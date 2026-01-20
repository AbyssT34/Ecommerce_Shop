"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: configService.get('FRONTEND_URL') || 'http://localhost:5173',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`🚀 Backend server running on: http://localhost:${port}/api`);
    console.log(`📊 Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map