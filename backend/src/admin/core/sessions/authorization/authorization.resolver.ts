import { Context, Query, Resolver } from '@nestjs/graphql';

import { AuthorizationAdminSessionsService } from './authorization.service';
import { AuthorizationAdminSessionsObj } from './dto/authorization.obj';

import { Ctx } from '@/types/context.type';

@Resolver()
export class AuthorizationAdminSessionsResolver {
  constructor(private readonly service: AuthorizationAdminSessionsService) {}

  @Query(() => AuthorizationAdminSessionsObj)
  async admin_sessions__authorization(
    @Context() context: Ctx
  ): Promise<AuthorizationAdminSessionsObj> {
    return await this.service.authorization(context);
  }
}
