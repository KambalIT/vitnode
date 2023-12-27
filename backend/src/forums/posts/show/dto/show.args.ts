import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class ShowPostsForumsArgs {
  @Field(() => String, { nullable: true })
  cursor: string | null;

  @Field(() => Int, { nullable: true })
  first: number | null;

  @Field(() => Int, { nullable: true })
  last: number | null;

  @Field(() => String, { nullable: true })
  topic_id: string | null;
}
