
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VendorDocument = HydratedDocument<Vendor>;

@Schema()
export class Vendor {
  @Prop({ type: String, required: true, unique: true })
  vendorId: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);