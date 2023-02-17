import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RoleDto } from './dtos/role.dto';
import { StatusDto } from './dtos/status.dto';
import { Role } from './entities/role.entity';
import { Status } from './entities/status.entity';

@Injectable()
export class LookupService {
    constructor(private connection: Connection) { }

    async getStatusList(): Promise<StatusDto[]> {
        const statuses = await this.connection
            .createQueryBuilder(Status, 'status')
            .orderBy('status.description', 'ASC')
            .getMany()
            .catch((ex) => {
                console.log(ex);
                throw ex;
            });
        if (!statuses || statuses.length <= 0) {
            return [];
        }

        const arr: StatusDto[] = [];
        for (const status of statuses) {
            const dto = new StatusDto();
            dto.id = status.id;
            dto.description = status.description;
            dto.key = status.key;
            arr.push(dto);
        }
        return arr;
    }

    async getRoleList(): Promise<RoleDto[]> {
        const roles = await this.connection
            .createQueryBuilder(Role, 'role')
            .orderBy('role.description', 'ASC')
            .getMany()
            .catch((ex) => {
                console.log(ex);
                throw ex;
            });
        if (!roles || roles.length <= 0) {
            return [];
        }

        const arr: RoleDto[] = [];
        for (const role of roles) {
            const dto = new RoleDto();
            dto.id = role.id;
            dto.description = role.description;
            dto.key = role.key;
            arr.push(dto);
        }
        return arr;
    }
}
