
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types,  } from 'mongoose';
import { Vendor } from './vendor.schema';
import { Manufacturer } from './manufacturer.schema';
import { ProductData, ProductStatus } from 'src/types/product.types';

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
    name: { type: String, required: true },
    type: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    vendorId: { type: String, required: true },
    manufacturerId: { type: String, required: true },
    storefrontPriceVisibility: { type: String, required: true },
    options: { type: String, required: true },
    variants: {
      id: { type: String, required: true },
      available: { type: Boolean, required: true },
      attributes: {
        packaging: { type: String, required: true },
        description: { type: String, required: true },
      },
      cost: { type: Number, required: true },
      currency: { type: String, required: true },
      depth: { type: String },
      description: { type: String, required: true },
      dimensionUom: { type: String },
      height: { type: String },
      width: { type: String },
      manufacturerItemCode: { type: String, required: true },
      manufacturerItemId: { type: String, required: true },
      packaging: { type: String, required: true },
      price: { type: Number, required: true },
      volume: { type: Number },
      volumeUom: { type: String },
      weight: { type: Number },
      weightUom: { type: String },
      optionName: { type: String, required: true },
      optionsPath: { type: String, required: true },
      optionsItemsPath: { type: String, required: true },
      active: { type: Boolean, required: true },
      itemCode: { type: String, required: true },
      images: [
        {
          fileName: { type: String, required: true },
          cdnLink: { type: String, required: false },
          i: { type: Number, required: true },
          alt: { type: String, required: false }
        }
      ]
    },
    images: [{
        fileName: { type: String, required: true },
        cdnLink: { type: String, required: false },
        i: { type: Number, required: true },
        alt: { type: String, required: false }
    }],
    availability: { type: String, required: true },
    isFragile: { type: Boolean, required: true },
    published: { type: String, required: true },
    isTaxable: { type: Boolean, required: true },
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

  @Prop({ })
  info: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

