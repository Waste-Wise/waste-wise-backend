const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
  },
});

const scheduleSchema = new mongoose.Schema({
  schedule_name: {
    type: String,
    required: true,
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  schedule_details: [
    {
      monday: [taskSchema],
      tuesday: [taskSchema],
      wednesday: [taskSchema],
      thursday: [taskSchema],
      friday: [taskSchema],
      saturday: [taskSchema],
      sunday: [taskSchema],
    },
  ],
});

module.exports = mongoose.model('Schedule', scheduleSchema);
