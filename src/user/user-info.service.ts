import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserInfoService {
    constructor(
        private connection: Connection,
    ) { }

    async findByEmail(email: string, statusKey?: string): Promise<User> {

        const query = this.connection
            .createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.userRoles', 'user_role')
            .leftJoinAndSelect('user_role.role', 'role')
            .leftJoinAndSelect('user.status', 'status')
            .where("LOWER(user.email) = LOWER(:email)", { email });
        if (statusKey) {
            query.andWhere("status.key=:statuskey", { statuskey: statusKey });
        }
        const user = await query
            .getOne()
            .catch(error => { throw error; });
        return user;
    }

    async findById(id: string): Promise<User> {
        const user = await this.connection
            .createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.userRoles', 'user_role')
            .leftJoinAndSelect('user_role.role', 'role')
            .leftJoinAndSelect('user.status', 'status')
            .where("user.id=:userid", { userid: id })
            .getOne()
            .catch(error => { throw error; });
        return user;
    }

    hasAssignedUserRoles(user: User): boolean {
        const userRoles = user.userRoles || [];
        const roles = userRoles.filter(r => r.role !== undefined).map(r => r.role);
        return roles.length > 0;
    }

    getUserName(user?: User): string {
        if (!user) { return ""; }
        return `${user.firstName} ${user.lastName}`;
    }
}