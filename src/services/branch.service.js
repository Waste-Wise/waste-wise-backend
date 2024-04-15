const { StatusCodes } = require('http-status-codes');
const {Branch} = require('../models');
const ErrorHandler = require('../utils/ErrorHandler');

const queryBranches = () => {
    return Branch.find();
}

const getBranchById = async (branchId) => {
    const branch = await Branch.findById(branchId);

    if (!branch) {
        throw new ErrorHandler('Branch not found', StatusCodes.NOT_FOUND);
    }

    return branch;
}

const updateBranchById = async (branchId, updateBody) => {
    try {
        const branch = await getBranchById(branchId);

        Object.assign(branch, updateBody);

        await branch.save();
    }
    catch(error) {
        throw new ErrorHandler('Branch update failed', StatusCodes.CONFLICT);
    }
    
}

const deleteBranchById = async (branchId) => {
    try {
        const branch = await getBranchById(branchId);

        await branch.deleteOne();
    }
    catch(error) {
        throw new ErrorHandler('Branch deletion failed', StatusCodes.CONFLICT);
    }
}

module.exports = {
    queryBranches,
    getBranchById,
    updateBranchById,
    deleteBranchById
}