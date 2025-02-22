import { useSearchParams } from 'next/navigation';

import { useGetSortByParamsAPI } from './use-get-sort-by-params-api';

interface Args<T> {
  defaultPageSize: number;
  search?: boolean;
  sortByEnum?: T;
}

export function usePaginationAPI<T extends { [key: string]: unknown }>({
  defaultPageSize,
  search,
  sortByEnum
}: Args<T>) {
  const searchParams = useSearchParams();
  const pagination = {
    first: Number(searchParams.get('first') ?? 0),
    last: Number(searchParams.get('last') ?? 0),
    cursor: searchParams.get('cursor') ?? null,
    search: search ? searchParams.get('search') ?? '' : '',
    sortBy: useGetSortByParamsAPI({ constEnum: sortByEnum })
  };
  const defaultFirst = !pagination.last ? defaultPageSize : null;

  return {
    ...pagination,
    first: pagination.first ? pagination.first : defaultFirst
  };
}

export const emptyPagination = {
  first: 0,
  last: 0,
  cursor: null,
  search: '',
  sortBy: null
};
