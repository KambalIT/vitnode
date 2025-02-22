import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ComponentType } from 'react';

import { Input } from '@/components/ui/input';
import { cx } from '@/functions/classnames';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  commandInputClassName
} from '@/components/ui/command';
import { ListContentFilterToolbarDataTable } from './list-content-filter-toolbar-data-table';
import { usePathname, useRouter } from '@/i18n';
import { useFilterToolbarDataTable } from '../hooks/use-filter-toolbar-data-table';

export interface ContentFilterToolbarDataTableProps {
  options: {
    label: string;
    value: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  isFetching?: boolean;
  searchState?: {
    onChange: (value: string) => void;
    value: string;
  };
}

export const ContentFilterToolbarDataTable = ({
  searchState,
  ...props
}: ContentFilterToolbarDataTableProps) => {
  const t = useTranslations('core');
  const { id, title } = useFilterToolbarDataTable();
  const searchParams = useSearchParams();
  const selectedValues = searchParams.getAll(id);
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <Command>
      {searchState ? (
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            onChange={e => searchState.onChange(e.target.value)}
            value={searchState.value}
            className={cx(
              commandInputClassName,
              'border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
            placeholder={title}
          />
        </div>
      ) : (
        <CommandInput placeholder={title} />
      )}

      <CommandList>
        {!searchState && <CommandEmpty>{t('no_results')}</CommandEmpty>}

        <CommandGroup>
          <ListContentFilterToolbarDataTable {...props} />
        </CommandGroup>

        {selectedValues.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={() => push(pathname)} className="justify-center text-center">
                {t('clear')}
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
};
