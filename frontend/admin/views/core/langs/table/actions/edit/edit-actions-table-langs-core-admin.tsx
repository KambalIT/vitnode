import { Pencil } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Loader } from '@/components/loader/loader';
import { ShowCoreLanguages } from '@/graphql/hooks';

const ModalEditActionsTableLangsCoreAdmin = lazy(() =>
  import('./modal-edit-actions-table-langs-core-admin').then(module => ({
    default: module.ModalEditActionsTableLangsCoreAdmin
  }))
);

export const EditActionsTableLangsCoreAdmin = (data: ShowCoreLanguages) => {
  const t = useTranslations('core');

  return (
    <TooltipProvider>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil />
                <span className="sr-only">{t('edit')}</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>

          <DialogContent>
            <Suspense fallback={<Loader />}>
              <ModalEditActionsTableLangsCoreAdmin {...data} />
            </Suspense>
          </DialogContent>

          <TooltipContent>
            <p>{t('edit')}</p>
          </TooltipContent>
        </Tooltip>
      </Dialog>
    </TooltipProvider>
  );
};
