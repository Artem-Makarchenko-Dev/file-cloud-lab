import { Module } from '@nestjs/common';
import { AdminUserResolver } from './admin-user.resolver';
import { UsersModule } from '../../users/users.module';
import { FilesModule } from '../../files/files.module';

@Module({
  imports: [UsersModule, FilesModule],
  providers: [AdminUserResolver],
})
export class AdminGraphQLModule {}
