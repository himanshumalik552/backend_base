import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EditUserDto } from './user-edit.dto';

export class CreateUserDto extends EditUserDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Email address' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'Password' })
    password: string;
}