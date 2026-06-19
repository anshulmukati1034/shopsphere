export const getPagination = (page, limit) => {
  const currentPage = Math.max(
    parseInt(page) || 1,
    1
  );

  const pageSize = Math.min(
    Math.max(parseInt(limit) || 10, 1),
    100
  );

  return {
    page: currentPage,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  };
};


export const getPagingData = (
  count,
  rows,
  page,
  limit
) => {
  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,

    pagination: {
      totalItems: count,
      totalPages,
      currentPage: page,
      pageSize: limit,

      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};