'use client';

import { Home, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { AvatarUser } from '@/components/user/avatar/avatar-user';
import { useSessionAdmin } from '@/admin/hooks/use-session-admin';
import { ItemUserBarAdmin } from './item-user-bar-admin';
import { useSignOutAdminAPI } from './hooks/use-sign-out-admin-api';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

import { ListNavAdmin } from '../../nav/list/list-nav-admin';

export const UserBarAdmin = () => {
  const t = useTranslations('admin');
  const tCore = useTranslations('core');
  const { session } = useSessionAdmin();
  const { mutateAsync } = useSignOutAdminAPI();

  if (!session) return null;
  const { email, name, ...rest } = session;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="rounded-full" size="icon">
          <AvatarUser user={{ name, ...rest }} sizeInRem={2} />
        </Button>
      </SheetTrigger>

      <SheetContent className="p-0">
        <SheetHeader className="p-4 flex-row items-center space-y-0 gap-2 text-left">
          <AvatarUser user={{ name, ...rest }} sizeInRem={1.75} />
          <div className="flex flex-col">
            <p className="font-medium leading-none text-base">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </SheetHeader>

        <div className="sm:hidden block">
          <div className="p-2">
            <ListNavAdmin />
          </div>

          <Separator className="my-2" />
        </div>

        <div className="px-2">
          <ItemUserBarAdmin href="/" target="_blank">
            <Home /> <span>{t('home_page')}</span>
          </ItemUserBarAdmin>

          <Separator className="my-2" />

          <ItemUserBarAdmin onClick={async () => await mutateAsync()}>
            <LogOut /> <span>{tCore('user-bar.log_out')}</span>
          </ItemUserBarAdmin>
        </div>
      </SheetContent>
    </Sheet>
  );
};
