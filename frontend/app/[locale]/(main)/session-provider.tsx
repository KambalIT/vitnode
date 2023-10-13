'use client';

import { ReactNode, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { SessionContext } from '@/hooks/core/use-session';
import { fetcher } from '@/graphql/fetcher';
import {
  Authorization_Core_Sessions,
  Authorization_Core_SessionsQuery,
  Authorization_Core_SessionsQueryVariables
} from '@/graphql/hooks';

interface Props {
  children: ReactNode;
  initialData: Authorization_Core_SessionsQuery | undefined;
}

export const SessionProvider = ({ children, initialData }: Props) => {
  const [enableSessionQuery, setEnableSessionQuery] = useState(!!initialData);

  const { data } = useQuery({
    queryKey: ['Authorization'],
    queryFn: async () =>
      fetcher<Authorization_Core_SessionsQuery, Authorization_Core_SessionsQueryVariables>({
        query: Authorization_Core_Sessions
      }),
    initialData,
    enabled: enableSessionQuery
  });

  return (
    <SessionContext.Provider value={{ session: data, setEnableSessionQuery }}>
      {children}
    </SessionContext.Provider>
  );
};
