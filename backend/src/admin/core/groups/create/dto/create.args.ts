import { ArgsType, Field } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { TextLanguageInput } from '@/types/database/text-language.type';

@ArgsType()
export class CreateAdminGroupsArgs {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Field(() => [TextLanguageInput])
  name: TextLanguageInput[];
}