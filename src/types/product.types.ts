export type ProductData = {
  name: string;
  type: string;
  shortDescription: string;
  description: string;
  vendorId: string;
  manufacturerId: string;
  storefrontPriceVisibility: ProductStorefrontPriceVisibility;
  options: ProductOptions;
  variants: Array<ProductVariant>;
  images: Array<ProductImage>;
  availability: ProductAvailability;
  isFragile: boolean;
  published: ProductPublishStatus;
  isTaxable: boolean;
}

type ProductVariant = {
  id: string;
  availablea: boolean;
  attributes: {
    packaging: string;
    description: string;
  },
  cost: number;
  currency: Currencies;
  depth: string | null;
  description: string;
  dimensionUom: string | null;
  height: string | null;
  width: string | null;
  manufacturerItemCode: string;
  manufacturerItemId: string;
  packaging: string;
  price: number;
  volume: number | null;
  volumeUom: string | null;
  weight: number | null;
  weightUom: string | null;
  optionName: string;
  optionsPath: string;
  optionsItemsPath: string;
  active: boolean;
  itemCode: string; 
}

export type Currencies = 'USD' | 'EUR';

export type ProductOptions = {
  id: string;
  name: string;
  dataField: string | null;
  values: {
    id: string;
    name: string;
    values: string;
  }
}

export type ProductImage = {
  filename: string;
  cdnLink: string | null;
  i: number;
  alt: string | null;
}

export type ProductStatus = 'active' | 'inactive' | 'pending';
export type ProductPublishStatus = 'published' | 'unpublished';
export type ProductAvailability = 'available' | 'unavailable';
export type ProductStorefrontPriceVisibility = 'members-only' | 'all' | 'none';
