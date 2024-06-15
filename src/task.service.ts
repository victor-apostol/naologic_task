import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createReadStream } from 'fs';
import { Product } from './schemas/product.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NODE_STREAM_INPUT, parse } from 'papaparse';
import { CsvPayloadDto } from './dto/csvPayload.dto';
import { join } from 'path';

@Injectable()
export class TaskService {
  @InjectModel(Product.name)
  private readonly productModel: Model<Product>;

  private readonly logger = new Logger(TaskService.name);

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const products = await this.processCsvFile(join(__dirname, './images40.csv'));

    console.log('products:', products);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // properly insert update 
      await session.commitTransaction();
      this.logger.log('Products and variants inserted successfully');
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error inserting products and variants:', error);
    } finally {
      session.endSession();
    } 
  }

  async processCsvFile(filePath: string): Promise<CsvPayloadDto[]> {
    return new Promise<CsvPayloadDto[]>((resolve, reject) => {
      const products: CsvPayloadDto[] = [];

      createReadStream(filePath)
        .pipe(parse(NODE_STREAM_INPUT, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }))
        .on('data', (row) => {
          const CsvPayloadDTO: CsvPayloadDto = Object.assign(new CsvPayloadDto(), row);
          products.push(CsvPayloadDTO);
        })
        .on('end', () => {
          this.logger.log("csv processed successfully");
          resolve(products);
        })
        .on('error', (error) => {
          this.logger.error('unable to read stream from csv file error: ', error);
          reject(error);
        });
    });
  }
}
