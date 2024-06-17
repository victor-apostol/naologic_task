import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import * as nano from 'nanoid';
import { Model } from 'mongoose';
import { NODE_STREAM_INPUT, parse } from 'papaparse';

import { Product, ProductDocument } from './schemas/product.schema';
import { Vendor, VendorDocument } from './schemas/vendor.schema';
import { Manufacturer, ManufacturerDocument } from './schemas/manufacturer.schema';
import { CsvPayloadDto } from './dto/csvPayload.dto';
import { ProductVariant } from './types/product.types';

@Injectable()
export class TaskService {
  @InjectModel(Product.name)
  private readonly productModel: Model<Product>;

  @InjectModel(Vendor.name)
  private readonly vendorModel: Model<Vendor>;

  @InjectModel(Manufacturer.name)
  private readonly manufacturerModel: Model<Manufacturer>;

  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(TaskService.name);

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Timeout(5000)
  async handleCron() {
    // need to setup transactions support for mongodb
    try {
      const csvFilePath = this.validateCsvFilePath();

      const payload = await this.processCsvFile(csvFilePath);
      payload.sort((first, second) => Number(first.ProductID) - Number(second.ProductID));

      for (let i = 0; i < payload.length; i++) {
        const targetProductId = payload[i].ProductID;
        const productPayload = payload[i];
        
        // should do separte validation upon csv reading not here
        if (productPayload.ProductID === null || productPayload.ManufacturerID === null || (isNaN(Number(productPayload.UnitPrice)))) {
          continue;
        }

        let dbProduct = await this.productModel.findOne({ productId: targetProductId });

        const manufacturer = await this.ensureEntityExists(this.manufacturerModel, { manufacturerId: productPayload.ManufacturerID });
        const vendor = await this.ensureEntityExists(this.vendorModel, { vendorId: productPayload.ManufacturerID });

        if (!dbProduct) {
          dbProduct = this.generateMongodbProduct(productPayload, targetProductId, vendor._id.toString(), manufacturer._id.toString());
        };

        for (let x = i; x < payload.length; x++) {
          if (payload[x].ProductID !== targetProductId) {
            i = x;
            break;
          }

          const productVariant = this.generateProductVariant(productPayload, targetProductId);
          dbProduct.data.variants.push(productVariant)       
        } 
        await dbProduct.save();
      }

      this.logger.log('done processing csv');
    } catch(err) {
      this.logger.error(`An error ocurred whilst importing: ${JSON.stringify(err)}`);
    }
  }

  async processCsvFile(filePath: string): Promise<CsvPayloadDto[]> {
    return await new Promise<CsvPayloadDto[]>((resolve, reject) => {
      const products: CsvPayloadDto[] = [];

      createReadStream(filePath)
        .pipe(parse(NODE_STREAM_INPUT, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }))
        // if CSV file is extremly large and server doesnt have enough RAM, could work with data in streams to no load memory
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

  private async ensureEntityExists(model: Model<Manufacturer | Vendor>, options: any): Promise<ManufacturerDocument | VendorDocument> {
    let entity = await model.findOne(options);

    if (!entity) {
      entity = await new model(options).save();
    }
    
    return entity;
  }

  private validateCsvFilePath(): string {
    const csvFileName = this.configService.get('CSV_FILE_NAME');
    const csvFilePath = join(__dirname, csvFileName);
    const existsCsv = existsSync(csvFilePath);

    if (!existsCsv) {
      throw new Error('Unable to open csv file at given path: ${csvFilePath}')
    }

    return csvFilePath;
  }

  private generateRandomId(numberOfChars: number): string {
    return [...Array(numberOfChars)].map(() => (Math.random().toString(36)[2])).join('');
  }

  private generateMongodbProduct(productPayload: CsvPayloadDto, targetProductId: string, vendorId: string, manufacturerId: string): ProductDocument {
    return new this.productModel({
      docId: nano.nanoid(), 
      productId: targetProductId,
      data: {
        name: productPayload.ProductName,
        type: 'unkown',
        shortDescription: productPayload.ProductDescription,
        vendorId, 
        manufacturerId, 
        storefrontPriceVisibility: 'unkown',
        options: [
          { 
            id: this.generateRandomId(10),
            dateField: null,
            values: {
              id: this.generateRandomId(10),
              name: productPayload.PKG,
              value: productPayload.PKG
            }
          },
          { 
            id: this.generateRandomId(10),
            dateField: null,
            values: {
              id: this.generateRandomId(10),
              name: productPayload.ItemDescription,
              value: productPayload.ItemDescription
            }
          },
        ],
        availability: productPayload.Availability, 
        images: [],
      },
      status: 'active',
      dataPublic: 'unkown',
      immutable: false,
      deploymentId: 'unkown',
      docType: 'unkown',
      companyId: 'unkown',
      namespace: 'unkown',
      info: {
        createdBy: 'unkown',  
        updatedBy: 'unkown',
        dataSource: 'unkown', 
        companyStatus: 'active',
        transactionId: 'unkown',
        userRequestId: 'unkown' 
      }
    })
  }

  private generateProductVariant(productPayload: CsvPayloadDto, targetProductId: string): ProductVariant {
    return {
      id: productPayload.ItemID,
      available: false,
      attributes: {
        packaging: productPayload.PKG,
        description: productPayload.ItemDescription
      },
      cost: productPayload.QuantityOnHand,
      currency: 'USD',
      depth: 'unkown',
      description: productPayload.ItemDescription,
      dimensionUom: 'unkown',
      height: 'unkown',
      width: 'unkown',
      manufacturerItemCode: productPayload.ManufacturerItemCode,
      manufacturerItemId: productPayload.ManufacturerID,
      packaging: productPayload.PKG,
      price: Number(productPayload.UnitPrice),
      volume: 0,
      volumeUom: null,
      weight: 0,
      weightUom: null,
      optionName: `${productPayload.PKG}, ${productPayload.ItemDescription}`,
      optionsPath: 'unknown',
      optionsItemsPath: 'unknown',
      active: false,
      images: [{
        fileName: productPayload.ImageFileName,
        cdnLink: productPayload.ItemImageURL,
        i: 0,
        alt: null,
      }],
      sku: `${productPayload.ManufacturerID}${targetProductId}${productPayload.PKG}`,
      itemCode: 'unknown'
    }
  }
}
