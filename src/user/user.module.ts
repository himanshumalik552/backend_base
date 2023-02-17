import { Module } from '@nestjs/common';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { UserInfoService } from './user-info.service';
import { UserManagementController } from './user-management.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [],
    providers: [UserService, PasswordHashService, UserInfoService],
    exports: [UserService],
    controllers: [UserController, UserManagementController]
})
export class UsersModule {}