const mongoose = require('mongoose');
const cron = require('node-cron');
const Transaction = require('./src/models/transaction');
const Schedule = require('./src/models/schedule');
const Branch = require('./src/models/branch');

const createTransaction = async (taskId, driverId, branchId) => {
	const transactionObj = {
		taskId: new mongoose.Types.ObjectId(taskId),
		driverId: new mongoose.Types.ObjectId(driverId),
		branchId,
		date: Date.now(),
	};

	console.log(transactionObj);

	// const transaction = await Transaction.create(transactionObj);
};

const getTaskByWeekDay = (scheduleDetails) => 'everyday';

const createTransactionJob = async () => {
	const branchs = await Branch.find().populate('schedules');

	branchs.forEach((branch) => {
		branch.schedules.forEach((schedule) => {
			if (!schedule.status) {
				return;
			}

			/* eslint-disable camelcase */
			schedule.schedule_details.forEach((schedule_details_obj) => {
				Object.entries(schedule_details_obj).forEach(async (weekdayEntry) => {
					// if(weekdayEntry[0] !== todayToWeekDay()) {
					//   return;
					// }

					const taskId = weekdayEntry[1].id;
					const driverId = schedule.assignedDriver;
					/* eslint-disable no-underscore-dangle */
					const branchId = branch._id;
					/* eslint-enable no-underscore-dangle */

					const transactObj = {
						taskId,
						driverId,
						branchId,
					};

					try {
						await createTransaction(taskId, driverId, branchId);
					} catch (e) {
						console.log('==================');
						// console.log(e);
						console.log(transactObj);
						console.log('==================');
					}
				});
			});
			/* eslint-enable camelcase */
		});
	});

	// const schedules = await Schedule.find({ status: true });

	// schedules.forEach(schedule => {
	//   obj = {
	//     driverId: schedule.assignedDriver,
	//     taskId: getTaskByWeekDay(schedule.schedule_details)
	//   }

	//   if(!obj.driverId) {
	//     return;
	//   }

	//   console.log(obj);
	// })
};

const runJobs = async () => {
	const cronExpression = '*/2 * * * * *';

	if (!cron.validate(cronExpression)) {
		throw new Error(`Invalid cron expression: ${cronExpression}`);
	}

	cron.schedule(
		cronExpression,
		() => {
			console.log('A cron job that runs every 2 secs');
			createTransactionJob();
		},
		{
			scheduled: true,
			timezone: 'Asia/Colombo',
		}
	);
};

module.exports = runJobs;
