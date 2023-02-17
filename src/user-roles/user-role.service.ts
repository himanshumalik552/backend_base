import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RoleDto } from '../lookup/dtos/role.dto';
import { Role } from '../lookup/entities/role.entity';
import { User } from '../user/entities/user.entity';
import { EditUserRoleDto } from './dtos/user.role-update.dto';
import { UserRole } from './entities/user.role.entity';

@Injectable()
export class UserRoleService {
    constructor(
        private connection: Connection,
    ) { }

    private roleToDto(obj?: Role): RoleDto {

        if (!obj) { return null; }

        const dto = new RoleDto();
        dto.id = obj.id;
        dto.key = obj.key;
        dto.description = obj.description;

        return dto;
    }

    private userRoleToDto(userRoles: UserRole[]): RoleDto[] {
        const dtos: RoleDto[]  = [];
        if (userRoles && userRoles.length > 0) {
            userRoles.forEach(ur => {
                const roleDto = this.roleToDto(ur.role);
                if (roleDto) {
                    dtos.push(roleDto);
                }
            })
        }

        return dtos;
    }
    
    async update(dto: EditUserRoleDto): Promise<RoleDto[]> {

        //Validation
        if (!dto.userId || !isUUID(dto.userId)) {
            throw new NotAcceptableException("Invalid user id. Expected UUID'");
        }
        else if (!dto.roleIds || dto.roleIds.length <= 0) {
            throw new NotAcceptableException("Role ids are required");
        }

        dto.roleIds.forEach(roleId => {
            if (!isUUID(roleId)) {
                throw new NotAcceptableException("One or more role ids are invalid. Expected UUID'");
            }
        })

        const requestedUser = await this.connection
            .createQueryBuilder(User, "user")
            .where("user.id=:userid", { userid: dto.userId })
            .getOne();
        if (!requestedUser) {
            throw new NotFoundException("User not found");
        }

        //Check if role already assigned
        const distinctRoleIds = [...new Set(dto.roleIds)];
        const requestedRoles = await this.connection
            .createQueryBuilder(Role, "role")
            .where("role.id in (:...roleids)", { roleids: distinctRoleIds })
            .getMany();
        if (!requestedRoles || requestedRoles.length !== distinctRoleIds.length) {
            throw new NotFoundException("One or more role could not be found");
        }

        const newRoles: UserRole[] = [];
        distinctRoleIds.forEach(roleId => {

            const newUserRole = new UserRole();
            newUserRole.id = uuidv4();
            newUserRole.user = requestedUser;
            newUserRole.role = requestedRoles.find(r => r.id === roleId);
            newRoles.push(newUserRole);
        })

        //Create a query runner, connect and start new transaction
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            //Delete existing user roles
            await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(UserRole)
                .where("user_id=:userid", { userid: dto.userId })
                .execute()
                .catch(error => {
                    throw error;
                });

            //Add new user roles
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(UserRole)
                .values(newRoles)
                .execute()
                .catch(error => {
                    throw error;
                });

            //Commit the transaction
            return await queryRunner.commitTransaction()
                .then(async () => {
                    return this.userRoleToDto(newRoles);
                });
        } catch (ex) {
            //Rollback the transaction
            if (queryRunner && queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw ex;
        } finally {
            if (queryRunner && (queryRunner.isTransactionActive || !queryRunner.isReleased)) {
                await queryRunner.release();
            }
        }
    }
}
