import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from '../../lookup/dtos/role.dto';
import { UserDto } from '../../user/dtos/user.dto';

export class UserRoleDto {

    @ApiProperty({ description: 'id' })
    id: string;

    @ApiProperty({ description: 'User', type: () => UserDto })
    user: UserDto;

    @ApiProperty({ description: 'Role', type: () => RoleDto })
    role: RoleDto;
}