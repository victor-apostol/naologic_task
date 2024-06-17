import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModuleAsyncOptions, MongooseModuleFactoryOptions, MongooseModuleOptions } from "@nestjs/mongoose";
import * as Joi from 'joi';

export const mongooseAsyncOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<MongooseModuleFactoryOptions> => {
    return {
      uri: configService.get<string>("MONGODB_URI")
    } as MongooseModuleOptions
  }, 
  inject: [ConfigService]
}

export const configValidationSchema = Joi.object({
  APP_PORT: Joi.number().required(),

  MONGODB_URI: Joi.string().required(),
  MONGODB_PORT: Joi.number().required(),
  MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
  MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
  
  CSV_FILE_NAME: Joi.string().required()
});