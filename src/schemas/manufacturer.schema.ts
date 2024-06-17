
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ManufacturerDocument = HydratedDocument<Manufacturer>;

@Schema()
export class Manufacturer {
  @Prop({ type: String, required: true, unique: true })
  manufacturerId: string;
}

export const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer);