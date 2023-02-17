import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/configs/jwt-auth.guard';
import { Roles } from '../auth/configs/roles.decorator';
import { roleKeys } from '../configs/app-constants';
import { RoleDto } from '../lookup/dtos/role.dto';
import { EditUserRoleDto } from './dtos/user.role-update.dto';
import { UserRoleService } from './user-role.service';

@ApiTags('User role')
@Controller('user-role')
@UseGuards(JwtAuthGuard)
export class UserRoleController {
    constructor(private readonly service: UserRoleService) { }

    @Post()
    @ApiBearerAuth()
    @Roles(...[roleKeys.admin])
    @ApiOperation({
        summary: 'Updates the role of a user',
        description: 'Updates the role of a user. Returns status 201 if updated successfully<h3>(Authorization required: Admin)</h3>'
    })
    @ApiOkResponse({ description: 'User role has been activated successfully.', type: [RoleDto] })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBody({ description: "Edit details", required: true, type: () => EditUserRoleDto })
    async updateUserRole(
        @Body() dto: EditUserRoleDto): Promise<RoleDto[]> {
        return this.service.update(dto);
    }
}