import { useQuery } from '@tanstack/react-query';

import { APIKeys } from '@/graphql/api-keys';
import { fetcher } from '@/graphql/fetcher';
import {
  Core_Languages__Show,
  Core_Languages__ShowQuery,
  Core_Languages__ShowQueryVariables
} from '@/graphql/hooks';
import { usePaginationAPI } from '@/hooks/core/utils/use-pagination-api';

export const useLangsAdminAPI = () => {
  const defaultPageSize = 10;
  const variables = usePaginationAPI({
    defaultPageSize
  });

  const query = useQuery({
    queryKey: [APIKeys.LANGUAGES_ADMIN, { ...variables }],
    queryFn: async () => {
      return await fetcher<Core_Languages__ShowQuery, Core_Languages__ShowQueryVariables>({
        query: Core_Languages__Show,
        variables
      });
    },
    placeholderData: previousData => previousData
  });

  return { ...query, defaultPageSize };
};
