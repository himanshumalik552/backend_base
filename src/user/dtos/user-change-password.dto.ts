import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeUserPasswordDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Old password' })
    oldPassword: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'New password' })
    newPassword: string;
}