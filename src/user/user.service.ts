import { ConflictException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import AppConfigurations from '../configs/app-configuration';
import { statusConfigurations } from '../configs/app-constants';
import { RoleDto } from '../lookup/dtos/role.dto';
import { StatusDto } from '../lookup/dtos/status.dto';
import { Role } from '../lookup/entities/role.entity';
import { Status } from '../lookup/entities/status.entity';
import { PasswordHashService } from '../password-hash/password-hash.service';
import { ChangeUserPasswordDto } from './dtos/user-change-password.dto';
import { CreateUserDto } from './dtos/user-create.dto';
import { EditUserDto } from './dtos/user-edit.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UserInfoService } from './user-info.service';

@Injectable()
export class UserService {
    constructor(
        private connection: Connection,
        private passwordHashService: PasswordHashService,
        private userInfoService: UserInfoService,
    ) { }

    private userToDto(user: User): UserDto {
        const dto = new UserDto();
        dto.id = user.id;
        dto.companyName = user.companyName;
        dto.email = user.email;
        dto.firstName = user.firstName;
        dto.lastName = user.lastName;
        dto.phoneNumber = user.phoneNumber;
        dto.status = this.statusToDto(user.status);
        dto.roles = [];

        if (user.userRoles && user.userRoles.length > 0) {
            user.userRoles.forEach(ur => {
                const roleDto = this.roleToDto(ur.role);
                if (roleDto) {
                    dto.roles.push(roleDto);
                }
            })
        }
        
        return dto;
    }

    private statusToDto(obj?: Status): StatusDto {

        if (!obj) { return null; }

        const dto = new StatusDto();
        dto.id = obj.id;
        dto.key = obj.key;
        dto.description = obj.description;

        return dto;
    }

    private roleToDto(obj?: Role): RoleDto {

        if (!obj) { return null; }

        const dto = new RoleDto();
        dto.id = obj.id;
        dto.key = obj.key;
        dto.description = obj.description;

        return dto;
    }

    async getUser(id: string): Promise<UserDto> {

        const user = await this.userInfoService.findById(id)
            .catch(error => { throw error; });
        return this.userToDto(user);
    }

    async getallUsers(): Promise<UserDto[]> {

        const users = await this.connection.getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userRoles', 'user_role')
            .leftJoinAndSelect('user_role.role', 'role')
            .leftJoinAndSelect('user.status', 'status')
            .orderBy('user.firstName', "ASC")
            .getMany()
            .catch(error => { throw error; });

        const userDtos = [];
        users.forEach(user => {
            userDtos.push(this.userToDto(user));
        });
        return userDtos;
    }

    async create(userDto: CreateUserDto): Promise<UserDto> {

        //Validate dto
        if (!userDto.email || !isEmail(userDto.email)) {
            throw new NotAcceptableException("Invalid email address");
        }
        else if (!userDto.firstName) {
            throw new NotAcceptableException("Invalid first name");
        }
        else if (!userDto.lastName) {
            throw new NotAcceptableException("Invalid last name");
        }
        else if (!userDto.password || userDto.password.length < 8) {
            throw new NotAcceptableException("Invalid password. Min. 8 chars are required");
        }
        else if (!userDto.phoneNumber) {
            throw new NotAcceptableException("Invalid phone number");
        }
        else if (!userDto.companyName) {
            throw new NotAcceptableException("Invalid company name");
        }

        //Check if user exist with input email
        const existingUser = await this.userInfoService.findByEmail(userDto.email);
        if (existingUser) {
            throw new ConflictException("Email " + userDto.email + " already registered");
        }

        const activeStatus = await this.connection
            .createQueryBuilder(Status, "status")
            .where("status.key=:statuskey", { statuskey: statusConfigurations.active })
            .getOne();
        if (!activeStatus) {
            throw new NotFoundException(`Status ${statusConfigurations.active} not found`);
        }


        //Create new user and copy information
        const newUser = new User();
        newUser.id = uuidv4();
        newUser.email = userDto.email;
        newUser.hashedPassword = await this.passwordHashService.hashPassword(userDto.password);
        newUser.firstName = userDto.firstName;
        newUser.lastName = userDto.lastName;
        newUser.phoneNumber = userDto.phoneNumber;
        newUser.companyName = userDto.companyName;
        newUser.status = activeStatus;

        //Save user 
        await this.connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(newUser)
            .execute()
            .catch(error => {
                throw error;
            });

        return this.userToDto(newUser);
    } 

    async update(dto: EditUserDto, userId: string): Promise<UserDto> {

        //Validate dto
        if (!dto.firstName) {
            throw new NotAcceptableException("Invalid first name");
        }
        else if (!dto.lastName) {
            throw new NotAcceptableException("Invalid last name");
        }
        else if (!dto.phoneNumber) {
            throw new NotAcceptableException("Invalid phone number");
        }
        else if (!dto.companyName) {
            throw new NotAcceptableException("Invalid company name");
        }

        //Check if user exist with input email
        const user = await this.userInfoService.findById(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        //Set object properties
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.phoneNumber = dto.phoneNumber;
        user.companyName = dto.companyName;

        //Update user
        await this.connection
            .createQueryBuilder()
            .update(User)
            .set({
                firstName : dto.firstName,
                lastName : dto.lastName,
                phoneNumber : dto.phoneNumber,
                companyName : dto.companyName,
            })
            .where('id=:userid', { userid: userId })
            .execute()
            .catch(error => { throw error; });

        return this.userToDto(user);
    }

    async changePassword(dto: ChangeUserPasswordDto, userId: string): Promise<boolean | any> {

        //Validate dto
        if (!dto.oldPassword) {
            throw new NotAcceptableException("Invalid old password");
        }
        else if (!dto.newPassword) {
            throw new NotAcceptableException("Invalid new password");
        }

        //Check if user exist with input id
        const user = await this.userInfoService.findById(userId);
        if (!user) {
            throw new UnauthorizedException();
        }

        //Check if input password is valid
        const doesPasswordMatch = await this.passwordHashService.comparePassword(dto.oldPassword, user.hashedPassword);
        if (!doesPasswordMatch) {
            throw new UnauthorizedException("Incorrect password");
        }

        //Hash the password
        const hashedPassword = await this.passwordHashService.hashPassword(dto.newPassword);
        user.hashedPassword = hashedPassword;

        //Update user
        await this.connection
            .createQueryBuilder()
            .update(User)
            .set({
                hashedPassword: hashedPassword,
            })
            .where('id=:userid', { userid: userId })
            .execute()
            .catch(error => { throw error; });

        return true;
    }

    async resetPassword(userIdToReset: string, userId: string): Promise<boolean | any> {

        //Check if user exist with input id
        const user = await this.userInfoService.findById(userId);
        if (!user) {
            throw new UnauthorizedException();
        }

        //Check if user exist with input id
        const requestedUser = await this.userInfoService.findById(userIdToReset);
        if (!requestedUser) {
            throw new NotFoundException("User not found");
        }

        const newPwd = AppConfigurations().defaultPassword;

        //Hash the password
        const hashedPassword = await this.passwordHashService.hashPassword(newPwd);
        user.hashedPassword = hashedPassword;

        //Update user
        await this.connection
            .createQueryBuilder()
            .update(User)
            .set({
                hashedPassword: hashedPassword,
            })
            .where('id=:userid', { userid: userIdToReset })
            .execute()
            .catch(error => { throw error; });

        return true;
    }
}