import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { DeleteAdminGroupsService } from './delete.service';
import { DeleteAdminGroupsArgs } from './dto/delete.args';

import { AdminAuthGuards } from '@/utils/guards/admin-auth.guards';

@Resolver()
export class DeleteAdminGroupsResolver {
  constructor(private readonly service: DeleteAdminGroupsService) {}

  @Mutation(() => String)
  @UseGuards(AdminAuthGuards)
  async core_groups__admin__delete(@Args() args: DeleteAdminGroupsArgs): Promise<string> {
    return await this.service.delete(args);
  }
}
