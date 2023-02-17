import { Body, Controller, Get, Patch, Put, Req, UseGuards } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/configs/jwt-auth.guard';
import { Payload } from '../configs/authconfiguration';
import { ChangeUserPasswordDto } from './dtos/user-change-password.dto';
import { EditUserDto } from './dtos/user-edit.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Gets logged in user details',
        description: 'Gets logged in user details. Returns status 201 if retrieved successfully<h3>(Authorization required: Admin)</h3>'
    })
    @ApiOkResponse({ description: 'User details have been retrieved successfully.', type: UserDto })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    async getUser(@Req() req: any): Promise<UserDto> {
        const user: Payload = req.user;
        return this.userService.getUser(user.id);
    }

    @Put()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Edits logged in user details',
        description: 'Edits logged in user details. Returns status 201 if saved successfully<h3>(Authorization required)</h3>'
    })
    @ApiOkResponse({ description: 'User details has been updated successfully.', type: UserDto })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBody({ description: "Information of the user to be updated", required: true, type: EditUserDto })
    async updateSelf(
        @Req() req: any,
        @Body() dto: EditUserDto): Promise<UserDto> {
        const user: Payload = req.user;
        return this.userService.update(dto, user.id);
    }

    @Patch()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Updates the password of logged-in user',
        description: 'Updates the password of logged-in user. Returns status 200 if updated successfully<h3>(Authorization required)</h3>'
    })
    @ApiAcceptedResponse({ description: 'Password has been changed successfully.' })
    @ApiNotFoundResponse({ description: 'User not found' })
    @ApiBody({ type: ChangeUserPasswordDto })
    async changePasswordLoggedInUser(
        @Body() changePasswordDto: ChangeUserPasswordDto,
        @Req() req: any): Promise<boolean> {
        const user: Payload = req.user;
        return this.userService.changePassword(changePasswordDto, user.id);
    }
}