// server/helpers/queryHelper.js

export const buildUserFilter = ({ search, status, isAdmin }) => {
  const filter = {};

  // Search - tìm kiếm theo name, email, phone
  if (search && search.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { email: { $regex: search.trim(), $options: 'i' } },
      { phone: { $regex: search.trim(), $options: 'i' } }
    ];
  }

  // Filter theo status
  if (status && ['active', 'inactive'].includes(status)) {
    filter.status = status;
  }

  // Filter theo isAdmin
  if (isAdmin !== '' && isAdmin !== undefined) {
    filter.isAdmin = isAdmin === 'true' || isAdmin === true;
  }

  return filter;
};

export const buildSortObject = (sortBy, sortOrder) => {
  const validSortFields = ['createdAt', 'name', 'email', 'purchasePoint', 'status'];
  const validSortOrders = ['asc', 'desc'];

  // Validate
  if (!validSortFields.includes(sortBy)) {
    sortBy = 'createdAt';
  }
  if (!validSortOrders.includes(sortOrder)) {
    sortOrder = 'desc';
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  return sort;
};