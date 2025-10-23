"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const typeorm_2 = require("./config/typeorm");
const project_entity_1 = require("./entities/project.entity");
const document_asset_entity_1 = require("./entities/document-asset.entity");
const training_job_entity_1 = require("./entities/training-job.entity");
const subscription_entity_1 = require("./entities/subscription.entity");
const integration_installation_entity_1 = require("./entities/integration-installation.entity");
const main_user_entity_1 = require("./entities/main-user.entity");
const file_processor_service_1 = require("./services/file-processor.service");
const uploads_controller_1 = require("./uploads/uploads.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({ useFactory: typeorm_2.typeOrmConfig }),
            typeorm_1.TypeOrmModule.forFeature([
                project_entity_1.Project,
                document_asset_entity_1.DocumentAsset,
                training_job_entity_1.TrainingJob,
                subscription_entity_1.Subscription,
                integration_installation_entity_1.IntegrationInstallation,
                main_user_entity_1.MainUser,
            ]),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        controllers: [uploads_controller_1.UploadsController],
        providers: [file_processor_service_1.FileProcessorService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map