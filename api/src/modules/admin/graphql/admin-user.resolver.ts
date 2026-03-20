import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminUserDto } from './dto/admin-user.dto';
import { UsersService } from '../../users/users.service';
import { FilesService } from '../../files/files.service';
import { Public } from '../../auth/decorators/public.decorator';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt-auth.guard';

@Public()
@UseGuards(GqlJwtAuthGuard)
@Resolver(() => AdminUserDto)
export class AdminUserResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  @Query(() => AdminUserDto, { name: 'adminUser' })
  async getAdminUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<AdminUserDto> {
    const user = await this.usersService.findById(id);

    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as AdminUserDto;
  }

  @ResolveField()
  role(@Parent() user: AdminUserDto) {
    return this.usersService.findRoleByUserId(user.id);
  }

  @ResolveField()
  files(@Parent() user: AdminUserDto) {
    return this.filesService.findByUserId(user.id);
  }
}
