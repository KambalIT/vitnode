import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';

import { APIKeys } from '@/graphql/api-keys';
import { fetcher } from '@/graphql/fetcher';
import {
  Maybe,
  ShowForumForums,
  ShowForumForumsWithParent,
  Show_Forum_Forums_Admin,
  Show_Forum_Forums_AdminQuery,
  Show_Forum_Forums_AdminQueryVariables
} from '@/graphql/hooks';

interface Args {
  parentId: string;
  enabled?: boolean;
}

// ! Be careful, this function is recursive with changed children type
const updateState = ({
  data,
  edges,
  parentId
}: {
  data: Show_Forum_Forums_AdminQuery;
  edges: ShowForumForumsWithParent[];
  parentId: string;
}): ShowForumForumsWithParent[] => {
  return edges.map(edge => {
    if (edge.id === parentId) {
      return {
        ...edge,
        children: data.show_forum_forums.edges as unknown as Maybe<ShowForumForums[]>
      };
    }

    if ((edge.children ?? []).length > 0) {
      return {
        ...edge,
        children: updateState({
          parentId,
          edges: edge.children as unknown as ShowForumForumsWithParent[],
          data
        }) as unknown as Maybe<ShowForumForums[]>
      };
    }

    return edge;
  });
};

export const useChildrenForumForumsAdminAPI = ({ enabled, parentId }: Args) => {
  const queryClient = useQueryClient();
  const { isFetching, isLoading } = useQuery({
    queryKey: [APIKeys.FORUMS_CHILDREN_ADMIN, { parentId }],
    queryFn: async () => {
      const data = await fetcher<
        Show_Forum_Forums_AdminQuery,
        Show_Forum_Forums_AdminQueryVariables
      >({
        query: Show_Forum_Forums_Admin,
        variables: {
          parentId
        }
      });

      queryClient.setQueryData<InfiniteData<Show_Forum_Forums_AdminQuery>>(
        [APIKeys.FORUMS_ADMIN],
        old => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map(page => ({
              ...page,
              show_forum_forums: {
                ...page.show_forum_forums,
                edges: updateState({
                  parentId,
                  edges: page.show_forum_forums.edges,
                  data
                })
              }
            }))
          };
        }
      );

      return data;
    },
    enabled
  });

  return {
    isLoading: isLoading || isFetching
  };
};