import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class ShowCoreLanguagesArgs {
  @Field(() => String, { nullable: true })
  cursor: string | null;

  @Field(() => Int, { nullable: true })
  first: number | null;

  @Field(() => Int, { nullable: true })
  last: number | null;
}
