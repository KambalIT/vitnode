'use client';

import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Suspense, lazy } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader/loader';

const CreateEditFormForumAdmin = lazy(() =>
  import('../create-edit-form/create-edit-form-forum-admin').then(module => ({
    default: module.CreateEditFormForumAdmin
  }))
);

export const ActionsForumsForumAdmin = () => {
  const t = useTranslations('core');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          {t('create')}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl">
        <Suspense fallback={<Loader />}>
          <CreateEditFormForumAdmin />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};
