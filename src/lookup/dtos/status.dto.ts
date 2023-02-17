import { ApiProperty } from '@nestjs/swagger';

export class StatusDto {

    @ApiProperty({ description: 'Id' })
    id: string;

    @ApiProperty({ description: 'Description' })
    description: string;

    @ApiProperty({ description: 'Static description' })
    key: string;
}