import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { UserInfoService } from '../user/user-info.service';
import { UsersModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './configs/constants';
import { JwtStrategy } from './configs/jwt.strategy';
import { LocalStrategy } from './configs/local.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '28800s' },
        }),
        //UsersModule,
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, PasswordHashService, UserInfoService],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }
