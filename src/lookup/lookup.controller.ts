import { CacheInterceptor, Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/configs/jwt-auth.guard';
import { Roles } from '../auth/configs/roles.decorator';
import { Payload } from '../configs/authconfiguration';
import { RoleDto } from './dtos/role.dto';
import { StatusDto } from './dtos/status.dto';
import { LookupService } from './lookup.service';

@ApiTags('Lookup')
@Controller('lookup/status')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CacheInterceptor)
export class LookupStatusController {
    constructor(private service: LookupService) { }

    @Get()
    @Roles(...['editor'])
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'List of lookup status',
        description:
            'Returns list of lookup status<h3>(Authorization required. Roles allowed: editor)</h3>',
    })
    @ApiOkResponse({
        description: 'Lookup status list has been retrieved successfully.',
        type: [StatusDto],
    })
    async getStatusList(@Req() req: any): Promise<StatusDto[]> {
        const user: Payload = req.user;
        return this.service.getStatusList();
    }
}

@ApiTags('Lookup')
@Controller('lookup/roles')
@UseGuards(JwtAuthGuard)
export class LookupRoleController {
    constructor(private service: LookupService) { }

    @Get()
    @Roles(...['editor'])
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'List of lookup roles',
        description:
            'Returns list of lookup roles<h3>(Authorization required. Roles allowed: editor)</h3>',
    })
    @ApiOkResponse({
        description: 'Lookup reason list has been retrieved successfully.',
        type: [RoleDto],
    })
    async getReasonList(@Req() req: any): Promise<RoleDto[]> {
        const user: Payload = req.user;
        return this.service.getRoleList();
    }
}