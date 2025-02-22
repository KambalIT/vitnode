import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignUpCoreMembersObj } from './dto/sign_up.obj';
import { SignUpCoreMembersService } from './sign_up.service';
import { SignUpCoreMembersArgs } from './dto/sign_up.args';

@Resolver()
export class SignUpCoreMembersResolver {
  constructor(private readonly service: SignUpCoreMembersService) {}

  @Mutation(() => SignUpCoreMembersObj)
  async core_members__sign_up(@Args() args: SignUpCoreMembersArgs): Promise<SignUpCoreMembersObj> {
    return this.service.signUp(args);
  }
}
