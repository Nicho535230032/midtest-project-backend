const topupService = require('./topups-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getTopups(req, res, next) {
  const {
    page_number = 1,
    sort = 'from:asc',
    search = null,
    page_size = 10,
  } = req.query;
  const pageNumber = parseInt(page_number);
  const pageSize = parseInt(page_size);
  const [sortField, sortOrder] = sort.split(':');
  try {
    const topups = await topupService.getTopups(
      pageNumber,
      pageSize,
      sortField,
      sortOrder,
      search
    );
    res.status(200).json(topups);
  } catch (error) {
    next(error);
  }
}

async function getTopup(req, res, next) {
  try {
    const topup = await topupService.getTopup(req.params.id);
    if (!topup) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Unknown Topup Data'
      );
    }
    return res.status(200).json(topup);
  } catch (error) {
    return next(error);
  }
}

async function createTopup(req, res, next) {
  const { total, from, to, notes } = req.body;
  try {
    const newTopup = await topupService.createTopup(total, from, to, notes);
    return res.status(201).json(newTopup);
  } catch (error) {
    console.error('Error creating top-up:', error);
    return next(error);
  }
}

async function updateTopupNotes(req, res, next) {
  const topupId = req.params.id;
  const { notes } = req.body;
  try {
    if (!notes) {
      throw new Error('Please fill the notes');
    }
    const updateTopup = await topupService.updateTopupNotes(topupId, notes);
    if (!updateTopup) {
      throw new Error('Failed to update topup notes');
    }
    return res.status(200).json(updateTopup);
  } catch (error) {
    return next(error);
  }
}

async function deleteTopup(req, res, next) {
  const topupId = req.params.id;
  return topupService
    .deleteTopup(topupId)
    .then(() => {
      return res.status(200).json({ message: 'Topup data deleted' });
    })
    .catch((error) => {
      return next(error);
    });
}

module.exports = {
  getTopups,
  getTopup,
  createTopup,
  updateTopupNotes,
  deleteTopup,
};
