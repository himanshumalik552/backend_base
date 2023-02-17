import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EditUserDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'First name' })
    firstName: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'Last name' })
    lastName: string;

    @ApiProperty({ description: 'Phone' })
    phoneNumber: string;

    @ApiProperty({ description: 'Company' })
    companyName: string;
}