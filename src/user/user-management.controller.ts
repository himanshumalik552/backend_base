import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/configs/jwt-auth.guard';
import { Roles } from '../auth/configs/roles.decorator';
import { roleKeys } from '../configs/app-constants';
import { Payload } from '../configs/authconfiguration';
import { CreateUserDto } from './dtos/user-create.dto';
import { EditUserDto } from './dtos/user-edit.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('User management')
@Controller('user-management')
@UseGuards(JwtAuthGuard)
export class UserManagementController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiBearerAuth()
    @Roles(...[roleKeys.admin])
    @ApiOperation({
        summary: 'List of the all users',
        description: 'Returns list of all users<h3>(Authorization required)</h3>'
    })
    @ApiOkResponse({ description: 'List of all users has been retrieved successfully.', type: [UserDto] })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getAll(): Promise<UserDto[]> {
        return this.userService.getallUsers();
    }

    @Post()
    @ApiBearerAuth()
    @Roles(...[roleKeys.admin])
    @ApiOperation({
        summary: 'Creates a new user',
        description: 'Creates a user. Returns status 201 if created successfully<h3>(Authorization required: Admin)</h3>'
    })
    @ApiOkResponse({ description: 'User has been created successfully.', type: UserDto })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBody({ description: "Information of the user to be created", required: true, type: CreateUserDto })
    async create(
        @Body() dto: CreateUserDto): Promise<UserDto> {
        return this.userService.create(dto);
    }

    @Put('/:userId')
    @ApiBearerAuth()
    @Roles(...[roleKeys.admin])
    @ApiOperation({
        summary: 'Edits a user details',
        description: 'Edits a user details. Returns status 201 if saved successfully<h3>(Authorization required: Admin)</h3>'
    })
    @ApiOkResponse({ description: 'User details has been updated successfully.', type: UserDto })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiParam({ name: "userId", description: "Id of the user to update", required: true, type: 'string' })
    @ApiBody({ description: "Information of the user to be updated", required: true, type: EditUserDto })
    async update(
        @Param('userId') userId,
        @Body() dto: EditUserDto): Promise<UserDto> {
        return this.userService.update(dto, userId);
    }

    @Patch('/:userId')
    @ApiBearerAuth()
    @Roles(...[roleKeys.admin])
    @ApiOperation({
        summary: 'Resets password of a user',
        description: 'Resets password of a user. Returns status 200 if updated successfully<h3>(Authorization required)</h3>'
    })
    @ApiAcceptedResponse({ description: 'Password has been reset successfully.' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiParam({ name: "userId", description: "Id of the user to update", required: true, type: 'string' })
    async resetPasswordUser(
        @Param('userId') userId,
        @Req() req: any): Promise<boolean> {
        const user: Payload = req.user;
        return this.userService.resetPassword(userId, user.id);
    }
}