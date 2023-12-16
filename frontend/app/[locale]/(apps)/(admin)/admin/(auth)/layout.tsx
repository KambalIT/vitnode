import configs from '~/config.json';

import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

import { AdminLayout } from '@/admin/layout/admin-layout';
import { SessionAdminProvider } from './session-admin-provider';
import { redirect } from '@/i18n';
import { CONFIG } from '@/config';
import { fetcher } from '@/graphql/fetcher';
import {
  Admin_Sessions__Authorization,
  Admin_Sessions__AuthorizationQuery,
  Admin_Sessions__AuthorizationQueryVariables
} from '@/graphql/hooks';
import { ErrorAdminView } from '@/admin/global/error-admin-view';

const getData = async () => {
  const cookieStore = cookies();

  if (!cookieStore.get(CONFIG.admin.access_token) && !cookieStore.get(CONFIG.admin.refresh_token)) {
    return;
  }

  return await fetcher<
    Admin_Sessions__AuthorizationQuery,
    Admin_Sessions__AuthorizationQueryVariables
  >({
    query: Admin_Sessions__Authorization,
    headers: {
      Cookie: cookies().toString()
    }
  });
};

interface Props {
  children: ReactNode;
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'admin' });

  const defaultTitle = `${t('title_short')} - ${configs.side_name}`;

  return {
    title: {
      default: defaultTitle,
      template: `%s - ${defaultTitle}`
    }
  };
}

export default async function Layout({ children }: Props) {
  try {
    const data = await getData();

    if (!data) return <ErrorAdminView />;

    return (
      <SessionAdminProvider data={data}>
        <AdminLayout>{children}</AdminLayout>
      </SessionAdminProvider>
    );
  } catch (error) {
    const errors = error as { errors: string[] };
    // eslint-disable-next-line no-console
    console.log(error, errors);

    redirect('/admin');
  }
}
