import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
    ApiAcceptedResponse,
    ApiBody,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './configs/local-auth.guard';
import { LoginUserDto } from './dtos/user-login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) { }

    @Post('login')
    @ApiOperation({
        summary: 'Authenticate user',
        description:
            'Returns a token and status code 201 if authenticated successfully',
    })
    @ApiAcceptedResponse({
        description: 'User has been authenticated successfully.',
    })
    @ApiUnauthorizedResponse({ description: 'Invalid username or password' })
    @ApiBody({ description: 'Credentials', required: true, type: () => LoginUserDto })
    @UseGuards(LocalAuthGuard)
    async login(@Request() req): Promise<any> {
        return this.service.login(req.user);
    }
}
