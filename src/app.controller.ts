import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
    constructor(private readonly service: AppService) {}

    @Get()
    @ApiOperation({
        summary: 'API Root endpoint',
        description: 'Endpoint for root to resolve 404',
    })
    @ApiOkResponse({
        description: 'Returns an okay response',
    })
    async getRootRequest(): Promise<any> {
        return this.service.handleRoot();
    }
}
