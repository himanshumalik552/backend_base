import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import "reflect-metadata";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //Enable CORS
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    //Use compression
    app.use(compression());

    //Validations
    app.useGlobalPipes(new ValidationPipe());

    // Add HTTP Basic Auth
    const apiName = 'api';
    const apiAccessConfig = {};
    apiAccessConfig["test"] = "test";

    app.use(
        [`/${apiName}`, `/${apiName}-json`],
        basicAuth({
            challenge: true,
            users: apiAccessConfig,
        }),
    );

    const description = `${"Backend API for <b> Fremaa Dashboard application </b>"}
                        ${"<br/><br/>"}
                        ${"All the endpoints available in the backend API are listed below. All of these endpoints require authorization token in order to use them. Please follow the steps below to authorize:"}
                        ${"<ul>"}
                        ${"<li>Make a post request in <b> Authentication </b> section</li>"}
                        ${"<li>Grab your token by copying it from the response</li>"}
                        ${"<li>Click on <b>Authorize</b> button</li>"}
                        ${"<li>Paste the copied token and click on authorize</li>"}
                        ${"<li>Now all the endpoints are available for testing</li>"}
                        ${"</ul>"}                          `
    const options = new DocumentBuilder()
        .addBearerAuth()
        .setTitle("Fremaa API")
        .setDescription(description)
        .setContact("Kaushal Sharma (Royal HaskoningDHV)", "", "kaushal.sharma@rhdhv.com")
        .setVersion("2023.1.0.0")
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(apiName, app, document);

    const apiPort = parseInt(process.env.PORT, 10) || 3002;
    const server = await app.listen(apiPort);
    server.setTimeout(600000);
}
bootstrap();