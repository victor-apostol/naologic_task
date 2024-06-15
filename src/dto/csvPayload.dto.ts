import { IsNumber, IsString } from "class-validator";

export class CsvPayloadDto {
  @IsString()
  SiteSource: string;

  @IsString()
  ItemID: string;

  @IsString()
  ManufacturerID: string;

  @IsString()
  ManufacturerCode: string;

  @IsString()
  ManufacturerName: string;

  @IsString()
  ProductID: string;

  @IsString()
  ProductName: string;

  @IsString()
  ProductDescription: string;

  @IsString()
  ManufacturerItemCode: string;
  
  @IsString()
  ItemDescription: string;

  @IsString()
  ImageFileName: string;

  @IsString()
  ItemImageURL: string;

  @IsString()
  NDCItemCode: string;

  @IsString()
  PKG: string;

  @IsString()
  UnitPrice: string;

  @IsNumber()
  QuantityOnHand: number;

  @IsString()
  PriceDescription: string;

  @IsString()
  Availability: string;
}