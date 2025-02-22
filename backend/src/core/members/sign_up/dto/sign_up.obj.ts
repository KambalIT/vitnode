import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, Matches, MaxLength, Min, MinLength } from 'class-validator';

import { nameRegex } from '@/utils/regex/name.regex';

@ObjectType()
export class SignUpCoreMembersObj {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(3)
  @MaxLength(32)
  @Matches(nameRegex)
  name: string;

  @Field(() => Int)
  @Min(10)
  birthday: number;

  @Field(() => Boolean, { nullable: true })
  newsletter: boolean | null;

  @Field(() => String)
  group_id: string;
}
