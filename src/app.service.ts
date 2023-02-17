import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    async handleRoot(): Promise<boolean> {
        return true;
    }
}
