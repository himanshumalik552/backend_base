import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { RoleDto } from '../../lookup/dtos/role.dto';
import { StatusDto } from '../../lookup/dtos/status.dto';

@Exclude()
export class UserDto {

    @Expose()
    @ApiProperty({ description: 'Id' })
    id: string;

    @Expose()
    @ApiProperty({ description: 'Email' })
    email: string;

    @Expose()
    @ApiProperty({ description: 'First name' })
    firstName: string;

    @Expose()
    @ApiProperty({ description: 'Last name' })
    lastName: string;

    @Expose()
    @ApiProperty({ description: 'Phone' })
    phoneNumber: string;

    @Expose()
    @ApiProperty({ description: 'Company' })
    companyName: string;

    @Expose()
    @ApiProperty({ description: 'Status', type: () => StatusDto })
    status: StatusDto;

    @Expose()
    @ApiProperty({ description: 'User roles', type: () => [RoleDto] })
    roles: RoleDto[];
}