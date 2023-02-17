import { CacheModule, Module } from '@nestjs/common';
import {
    LookupRoleController,
    LookupStatusController
} from './lookup.controller';
import { LookupService } from './lookup.service';

@Module({
    imports: [CacheModule.register()],
    controllers: [
        LookupStatusController,
        LookupRoleController,
    ],
    providers: [LookupService],
})
export class LookupModule { }
