import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsUniqueLoginConstraint } from 'src/validators/is-unique-login.validator';

@Module({
  controllers: [UsersController],
  providers: [UsersService, IsUniqueLoginConstraint],
})
export class UsersModule {}
