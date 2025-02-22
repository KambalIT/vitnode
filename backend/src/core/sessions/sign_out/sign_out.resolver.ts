import { Context, Mutation, Resolver } from '@nestjs/graphql';

import { SignOutCoreSessionsService } from './sign_out.service';

import { Ctx } from '@/types/context.type';

@Resolver()
export class SignOutCoreSessionsResolver {
  constructor(private readonly service: SignOutCoreSessionsService) {}

  @Mutation(() => String)
  async core_sessions__sign_out(@Context() context: Ctx): Promise<string> {
    return await this.service.signOut(context);
  }
}
