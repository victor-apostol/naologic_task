
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types,  } from 'mongoose';
import { Vendor } from './vendor.schema';
import { Manufacturer } from './manufacturer.schema';
import { ProductData, ProductInfo, ProductStatus } from 'src/types/product.types';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  //index
  @Prop({ required: true, unique: true })
  productId: string;

  @Prop({ required: true })
  docId: string;

  @Prop()
  fullData: string | null;

  @Prop({
    name: { type: String },
    type: { type: String },
    shortDescription: { type: String },
    description: { type: String },
    vendorId: { type: Types.ObjectId, ref: Vendor },
    manufacturerId: { type: Types.ObjectId, ref: Manufacturer },
    storefrontPriceVisibility: { type: String },
    options: { 
      type: [
        {
          id: { type: String },
          name: { type: String, default: 'packaging' },
          dataField: { type: String , nullable: true},
          values: [
              {
                id: { type: String },
                name: { type: String, nullable: true },
                value: { type: String, nullable: true }
              }
          ]
      },
      {
        id: { type: String },
        name: { type: String },
        dataField: { type: String , nullable: true},
          values: [
              {
                id: { type: String },
                name: { type: String, default: 'description' },
                value: { type: String, nullable: true }
              }
          ]
      }
      ] 
    },
    variants: {
      type: [{
        id: { type: String },
        available: { type: Boolean },
        attributes: {
          packaging: { type: String },
          description: { type: String },
        },
        cost: { type: Number },
        currency: { type: String },
        depth: { type: String },
        description: { type: String },
        dimensionUom: { type: String },
        height: { type: String },
        width: { type: String },
        manufacturerItemCode: { type: String },
        manufacturerItemId: { type: String },
        packaging: { type: String },
        price: { type: Number },
        volume: { type: Number },
        volumeUom: { type: String },
        weight: { type: Number },
        weightUom: { type: String },
        optionName: { type: String },
        optionsPath: { type: String },
        optionsItemsPath: { type: String },
        active: { type: Boolean },
        itemCode: { type: String },
        sku: { type: String },
        images: [
          {
            fileName: { type: String },
            cdnLink: { type: String }, 
            i: { type: Number },
            alt: { type: String }
          }
        ]
      }],
      default: [],
    },
    images: [{
      fileName: { type: String },
      cdnLink: { type: String, nullable: true },
      i: { type: Number, default: 0 },
      alt: { type: String, nullable: true }
    }],
    availability: { type: String },
    isFragile: { type: Boolean, default: true },
    published: { type: String, default: false },
    isTaxable: { type: Boolean, default: true },
  })
  data: ProductData;

  @Prop()
  dataPublic: string;

  @Prop({ required: true })
  immutable: boolean;

  @Prop({ required: true })
  deploymentId: string;

  @Prop({ required: true })
  docType: string;

  @Prop({ required: true })
  namespace: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  status: ProductStatus;

  @Prop({ 
    type: {
      createdBy: { type: String, required: true },
      createdAt: { type: Date, default: Date.now() },
      updatedBy: { type: String, required: true, default: '' },
      updatedAt: { type: Date },
      deletedBy: { type: String, nullable: true, default: null },
      deletedAt: { type: String, nullable: true, default: null },
      dataSource: { type: String, required: true },
      companyStatus: { type: String, required: true },
      transactionId: { type: String, required: true },
      skipEvent: { type: Boolean, required: true, default: false },
      userRequestId: { type: String }  
    },
  })
  info: ProductInfo;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
