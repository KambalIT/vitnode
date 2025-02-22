'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSessionAdmin } from '@/admin/hooks/use-session-admin';
import { useGeneralSettingsAdminAPI } from './hooks/use-general-settings-admin-api';

export const FormGeneralCoreAdmin = () => {
  const { side_name } = useSessionAdmin();
  const t = useTranslations('admin');
  const tCore = useTranslations('core');
  const { isPending, mutateAsync } = useGeneralSettingsAdminAPI();

  const formSchema = z.object({
    name: z
      .string({
        required_error: tCore('forms.empty')
      })
      .min(1, {
        message: tCore('forms.empty')
      })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: side_name
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync({
      sideName: values.name
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('core.general.main.form.name.label')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" loading={isPending}>
          {tCore('save')}
        </Button>
      </form>
    </Form>
  );
};
