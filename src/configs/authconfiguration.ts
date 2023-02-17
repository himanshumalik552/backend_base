import { JwtModuleOptions } from "@nestjs/jwt";
import { jwtConstants } from "../auth/configs/constants";

export default function JwtAuthOptions(): JwtModuleOptions {
    const options: JwtModuleOptions = {
        secret: jwtConstants.secret,
        signOptions: { expiresIn: process.env.API_AUTH_EXPIRY },
    };

    return options;
};

export type Payload = {
    id: string;
    roles: string[];
    exp?: any;
};
