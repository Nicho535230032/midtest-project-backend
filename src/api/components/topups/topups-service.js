const topupRepository = require('./topups-repository');

async function getTopups(
  pageNumber = 1,
  pageSize = 10,
  sortBy = 'total',
  sortOrder = 'asc',
  searchParameter = null
) {
  let topupData = await topupRepository.getTopups();
  if (searchParameter) {
    const [searchField, searchTerm] = searchParameter.split(':');
    const searchRegex = new RegExp(searchTerm, 'i');
    topupData = topupData.filter((topup) =>
      topup[searchField].match(searchRegex)
    );
  }
  topupData.sort((a, b) => {
    const firstSort = a[sortBy];
    const secondSort = b[sortBy];

    if (typeof firstSort === 'string' && typeof secondSort === 'string') {
      return sortOrder === 'asc'
        ? firstSort.localeCompare(secondSort)
        : secondSort.localeCompare(firstSort);
    } else {
      return sortOrder === 'asc'
        ? firstSort - secondSort
        : secondSort - firstSort;
    }
  });

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = pageNumber * pageSize;
  const dataPerPage = topupData.slice(startIndex, endIndex);
  const totalTopups = topupData.length;
  const totalPages = Math.ceil(totalTopups / pageSize);

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: dataPerPage.length,
    total_pages: totalPages,
    has_previous_page: pageNumber > 1,
    has_next_page: endIndex < totalTopups,
    data: dataPerPage.map((topup) => ({
      id: topup.id,
      total: topup.total,
      from: topup.from,
      to: topup.to,
      notes: topup.notes,
    })),
  };
}

async function getTopup(id) {
  const topup = await topupRepository.getTopup(id);
  if (!topup) {
    return null;
  }
  return {
    id: topup.id,
    total: topup.total,
    from: topup.from,
    to: topup.to,
    notes: topup.notes,
  };
}

async function createTopup(total, from, to, notes) {
  try {
    const newTopup = await topupRepository.createTopup(total, from, to, notes);
    return newTopup;
  } catch (error) {
    console.error('Error creating top-up:', error);
    throw new Error('Failed to create top-up: ' + error.message);
  }
}

async function updateTopupNotes(id, notes) {
  try {
    const topup = await topupRepository.getTopup(id);
    if (!topup) {
      return null;
    }
    return await topupRepository.updateTopupNotes(id, notes);
  } catch (error) {
    throw new Error('Failed to update topup notes');
  }
}

async function deleteTopup(id) {
  const topup = await topupRepository.getTopup(id);
  if (!topup) {
    return null;
  }
  try {
    await topupRepository.deleteTopup(id);
  } catch (err) {
    return null;
  }
  return true;
}

module.exports = {
  getTopups,
  getTopup,
  createTopup,
  updateTopupNotes,
  deleteTopup,
};
