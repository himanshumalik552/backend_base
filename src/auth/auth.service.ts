import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../configs/authconfiguration';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { UserInfoService } from '../user/user-info.service';

@Injectable()
export class AuthService {
    constructor(
        private userInfoService: UserInfoService,
        private passwordHashService: PasswordHashService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any | { status: number }> {
        const user = await this.userInfoService.findByEmail(email);
        if (!user) {
            return null;
        }

        const doesPasswordMatch = await this.passwordHashService.comparePassword(pass, user.hashedPassword);
        return doesPasswordMatch ? user : null;
    }

    async login(user: any) {

        //const userRoles = user.userRoles || [];
        //const roles = userRoles
        //    .filter(u => u.role !== undefined)
        //    .map(u => u.role.key);

        const payload: Payload = {
            id: user.id,
            roles: []
        };
        
        return {
            status: 200,
            expires_in: 28800,
            token: this.jwtService.sign(payload),
        };
    }
}