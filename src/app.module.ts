import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationModule } from './applications/application.module';

@Module({
  imports: [AuthModule, UsersModule, JobsModule, ApplicationModule]
})
export class AppModule {}
