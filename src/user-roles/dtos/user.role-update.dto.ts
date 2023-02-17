import { ApiProperty } from '@nestjs/swagger';

export class EditUserRoleDto {

    @ApiProperty({ description: 'User id' })
    userId: string;

    @ApiProperty({ description: 'Role ids' })
    roleIds: string[];
}