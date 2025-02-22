import { useTranslations } from 'next-intl';

import { HeaderContent } from '@/components/header-content/header-content';
import { TableLangsCoreAdmin } from './table/table-langs-core-admin';

export const LangsCoreAdminView = () => {
  const t = useTranslations('admin.core.langs');

  return (
    <>
      <HeaderContent h1={t('title')} />

      <TableLangsCoreAdmin />
    </>
  );
};
