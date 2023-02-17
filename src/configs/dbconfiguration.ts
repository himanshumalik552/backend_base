import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default function typeOrmOptions(): TypeOrmModuleOptions {
    const options: TypeOrmModuleOptions = {
        type: 'postgres',
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: false,
        autoLoadEntities: false,
    };

    return options;
};