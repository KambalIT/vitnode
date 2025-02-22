import { Field, Int, ObjectType } from '@nestjs/graphql';

import { PageInfo } from '@/types/database/pagination.type';
import { TextLanguage } from '@/types/database/text-language.type';

@ObjectType()
export class ShowAdminGroupsObj {
  @Field(() => [ShowAdminGroups])
  edges: ShowAdminGroups[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

@ObjectType()
export class ShowAdminGroups {
  @Field(() => String)
  id: string;

  @Field(() => [TextLanguage])
  name: TextLanguage[];

  @Field(() => Int)
  users_count: number;

  @Field(() => Int)
  created: number;

  @Field(() => Int)
  updated: number;

  @Field(() => Boolean)
  protected: boolean;

  @Field(() => Boolean)
  root: boolean;

  @Field(() => Boolean)
  default: boolean;

  @Field(() => Boolean)
  guest: boolean;
}
