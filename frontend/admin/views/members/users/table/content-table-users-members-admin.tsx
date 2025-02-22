import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';

import {
  UsersMembersAdminAPIDataType,
  useUsersMembersAdminAPI
} from './hooks/use-users-members-admin-api';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from '@/i18n';
import { buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import { Loader } from '@/components/loader/loader';
import { AvatarUser } from '@/components/user/avatar/avatar-user';
import { DateFormat } from '@/components/date-format/date-format';
import { GroupsFiltersUsersMembersAdmin } from './filters/groups-filters-users-members-admin';
import { AdvancedFiltersUsersMembersAdmin } from './filters/advanced/advanced-filters-users-members-admin';
import { useTextLang } from '@/hooks/core/use-text-lang';
import { HeaderSortingDataTable } from '@/components/data-table/header-sorting-data-table';

export const ContentTableUsersMembersAdmin = () => {
  const t = useTranslations('admin.members.users');
  const tCore = useTranslations('core');
  const { data, defaultPageSize, isFetching, isLoading, isPending } = useUsersMembersAdminAPI();
  const { convertText } = useTextLang();

  const columns: ColumnDef<UsersMembersAdminAPIDataType>[] = useMemo(
    () => [
      {
        header: t('table.name'),
        accessorKey: 'name',
        cell: ({ row }) => {
          const data = row.original;

          return (
            <div className="flex items-center gap-2 flex-wrap">
              <AvatarUser user={data} sizeInRem={2} />

              <span>{data.name}</span>
            </div>
          );
        }
      },
      {
        header: t('table.email'),
        accessorKey: 'email'
      },
      {
        header: t('table.group'),
        accessorKey: 'group',
        cell: ({ row }) => {
          const data = row.original;

          return convertText(data.group.name);
        }
      },
      {
        header: val => {
          return <HeaderSortingDataTable {...val}>{t('table.joined')}</HeaderSortingDataTable>;
        },
        accessorKey: 'joined',
        cell: ({ row }) => {
          const data = row.original;

          return <DateFormat date={data.joined} />;
        }
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const data = row.original;

          return (
            <div className="flex items-center justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/admin/members/users/${data.id}`}
                      className={buttonVariants({
                        variant: 'ghost',
                        size: 'icon'
                      })}
                    >
                      <Pencil />
                      <span className="sr-only">{tCore('edit')}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{tCore('edit')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        }
      }
    ],
    []
  );

  if ((isLoading && !isFetching) || isPending) return <Loader />;

  return (
    <DataTable
      data={data?.core_members__admin__show.edges ?? []}
      pageInfo={data?.core_members__admin__show.pageInfo}
      defaultPageSize={defaultPageSize}
      columns={columns}
      isFetching={isFetching}
      searchPlaceholder={t('search_placeholder')}
      filters={<GroupsFiltersUsersMembersAdmin />}
      advancedFilters={<AdvancedFiltersUsersMembersAdmin />}
      defaultSorting={{
        sortBy: 'joined',
        sortDirection: 'desc'
      }}
    />
  );
};
