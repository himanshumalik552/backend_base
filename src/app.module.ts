import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/configs/jwt.strategy';
import typeOrmOptions from './configs/dbconfiguration';
import { LookupModule } from './lookup/lookup.module';
import { UserRoleModule } from './user-roles/user-role.module';
import { UsersModule } from './user/user.module';

@Module({
    imports: [
        JwtStrategy,
        AuthModule,
        LookupModule,
        ConfigModule.forRoot({ load: [typeOrmOptions] }),
        TypeOrmModule.forRoot(typeOrmOptions()),
        UsersModule,
        UserRoleModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
