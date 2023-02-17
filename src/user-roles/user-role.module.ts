import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';

@Module({
    imports: [],
    providers: [UserRoleService],
    exports: [UserRoleService],
    controllers: [UserRoleController]
})
export class UserRoleModule {}