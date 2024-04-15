const { StatusCodes } = require('http-status-codes');
const { Branch } = require('../models');
const ErrorHandler = require('../utils/ErrorHandler');

const createBranch = async (branchObj) => {
  try {
    return Branch.create(branchObj);
  } catch (error) {
    throw new ErrorHandler(error.message, error.statusCode);
  }
};

const getAllBranches = () => {
  try {
    return Branch.find();
  } catch (error) {
    throw new ErrorHandler(error.message, error.statusCode);
  }
};

const getBranchById = async (branchId) => {
  try {
    const branch = await Branch.findById(branchId);

    if (!branch) {
      throw new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND);
    }

    return branch;
  } catch (error) {
    throw new ErrorHandler(error.message, error.statusCode);
  }
};

const getBranchhByIdPopulated = async (branchId) => {
  try {
    const branch = await Branch.findById(branchId)
      .populate('drivers')
      .populate('vehicles')
      .populate('routes');

    if (!branch) {
      throw new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND);
    }

    return branch;
  } catch (error) {
    throw new ErrorHandler(error.message, error.statusCode);
  }
};

const updateBranchById = async (branchId, updateBody) => {
  try {
    const branch = await getBranchById(branchId);

    Object.assign(branch, updateBody);

    await branch.save();
  } catch (error) {
    throw new ErrorHandler(error.message, error.statusCode);
  }
};

const deleteBranchById = async (branchId) => {
  try {
    const branch = await getBranchById(branchId);

    await branch.deleteOne();
  } catch (error) {
    throw new ErrorHandler(error.message, error.statusCode);
  }
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranchById,
  deleteBranchById,
  getBranchhByIdPopulated,
};
