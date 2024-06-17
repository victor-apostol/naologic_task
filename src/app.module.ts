import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { configValidationSchema, mongooseAsyncOptions } from './config/options';
import { Product, ProductSchema } from './schemas/product.schema';
import { LoggerModule } from 'nestjs-pino';
import { Manufacturer, ManufacturerSchema } from './schemas/manufacturer.schema';
import { Vendor, VendorSchema } from './schemas/vendor.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false
      }
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync(mongooseAsyncOptions),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: Vendor.name, schema: VendorSchema }
    ])
  ],
  providers: [TaskService],
})
export class AppModule {}
