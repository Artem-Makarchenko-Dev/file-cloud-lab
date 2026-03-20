import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AdminFileDto } from './admin-file.dto';
import { AdminRoleDto } from './admin-role.dto';

@ObjectType()
export class AdminUserDto {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => AdminRoleDto)
  role: AdminRoleDto;

  @Field(() => [AdminFileDto])
  files: AdminFileDto[];
}
