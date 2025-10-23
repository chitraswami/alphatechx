"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const project_entity_1 = require("../entities/project.entity");
const document_asset_entity_1 = require("../entities/document-asset.entity");
const training_job_entity_1 = require("../entities/training-job.entity");
const subscription_entity_1 = require("../entities/subscription.entity");
const integration_installation_entity_1 = require("../entities/integration-installation.entity");
const typeOrmConfig = async () => {
    const host = process.env.POSTGRES_HOST || 'localhost';
    const port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
    const username = process.env.POSTGRES_USER || 'postgres';
    const password = process.env.POSTGRES_PASSWORD || 'postgres';
    const database = process.env.POSTGRES_DB || 'bot_service';
    return {
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        entities: [project_entity_1.Project, document_asset_entity_1.DocumentAsset, training_job_entity_1.TrainingJob, subscription_entity_1.Subscription, integration_installation_entity_1.IntegrationInstallation],
        synchronize: true,
        logging: false,
    };
};
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.js.map