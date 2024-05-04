const { Topup } = require('../../../models');

async function getTopups() {
  return Topup.find({});
}

async function getTopup(id) {
  return Topup.findById(id);
}

async function createTopup(total, from, to, notes) {
  try {
    const newTopup = await Topup.create({ total, from, to, notes });
    return newTopup;
  } catch (error) {
    console.error('Error creating top-up:', error);
    throw new Error('Failed to create top-up: ' + error.message);
  }
}

async function updateTopupNotes(id, notes) {
  try {
    const updatedTopup = await Topup.findByIdAndUpdate(
      id,
      { notes },
      { new: true }
    );
    if (!updatedTopup) {
      throw new Error('Topup not found');
    }
    return updatedTopup;
  } catch (error) {
    console.error('Error updating topup notes:', error);
    throw new Error('Failed to update topup notes: ' + error.message);
  }
}

async function deleteTopup(id) {
  try {
    const deletedTopup = await Topup.findByIdAndDelete(id);
    if (!deletedTopup) {
      throw new Error('Topup not found');
    }
    return deletedTopup;
  } catch (error) {
    console.error('Error deleting topup:', error);
    throw new Error('Failed to delete topup: ' + error.message);
  }
}

module.exports = {
  getTopups,
  getTopup,
  createTopup,
  updateTopupNotes,
  deleteTopup,
};
