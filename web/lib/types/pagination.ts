export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginationResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
