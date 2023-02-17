import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
    @ApiProperty({ description: 'Role id' })
    id: string;

    @ApiProperty({ description: 'Role description' })
    description: string;

    @ApiProperty({ description: 'Role key' })
    key: string;
}