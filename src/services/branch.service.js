const { StatusCodes } = require('http-status-codes');
const ErrorHandler = require('../utils/ErrorHandler');
const { Branch } = require('../models');

const createBranch = async (branchObj) => {
  return Branch.create(branchObj);
};

const getAllBranches = () => {
  return Branch.find();
};

const getBranchById = async (branchId) => {
  const branch = await Branch.findById(branchId);

  if (!branch) {
    throw new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND);
  }

  return branch;
};

const getBranchhByIdPopulated = async (branchId) => {
  const branch = await Branch.findById(branchId)
    .populate('drivers')
    .populate('vehicles')
    .populate('routes');

  if (!branch) {
    throw new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND);
  }

  return branch;
};

const updateBranchById = async (branchId, updateBody) => {
  const branch = await getBranchById(branchId);

  Object.assign(branch, updateBody);

  await branch.save();

  return branch;
};

const deleteBranchById = async (branchId) => {
  const branch = await getBranchById(branchId);

  await branch.deleteOne();
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranchById,
  deleteBranchById,
  getBranchhByIdPopulated,
};
