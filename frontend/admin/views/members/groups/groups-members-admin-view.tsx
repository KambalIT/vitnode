import { useTranslations } from 'next-intl';

import { HeaderContent } from '@/components/header-content/header-content';
import { TableGroupsMembersAdmin } from './table/table-groups-members-admin';
import { ActionsGroupsMembersAdmin } from './actions/actions-groups-members-admin';

export const GroupsMembersAdminView = () => {
  const t = useTranslations('admin.members.groups');

  return (
    <>
      <HeaderContent h1={t('title')}>
        <ActionsGroupsMembersAdmin />
      </HeaderContent>

      <TableGroupsMembersAdmin />
    </>
  );
};
