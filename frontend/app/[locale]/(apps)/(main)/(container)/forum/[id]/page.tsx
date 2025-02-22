import { cookies } from 'next/headers';

import { ForumForumView } from '@/themes/default/core/views/forum/forums/views/[id]/forum-forum-view';
import { fetcher } from '@/graphql/fetcher';
import {
  Forum_Forums__Show_Item,
  Forum_Forums__Show_ItemQuery,
  Forum_Forums__Show_ItemQueryVariables
} from '@/graphql/hooks';
import { getUuidFromString } from '@/functions/url';

const getData = async ({ id }: { id: string }) => {
  return await fetcher<Forum_Forums__Show_ItemQuery, Forum_Forums__Show_ItemQueryVariables>({
    query: Forum_Forums__Show_Item,
    variables: {
      forumId: getUuidFromString(id)
    },
    headers: {
      Cookie: cookies().toString()
    }
  });
};

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params: { id } }: Props) {
  const data = await getData({ id });

  return <ForumForumView {...data} />;
}
