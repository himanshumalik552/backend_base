import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        request.user = user;
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}