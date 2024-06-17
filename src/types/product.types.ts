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

export type ProductVariant = {
  id: string;
  available: boolean;
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
  sku: string;
  images: Array<ProductImage>;
  itemCode: string; 
}

export type ProductInfo = {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedBy: string;
  deletedAt: string;
  dataSource: string | null;
  companyStatus: CompanyStatus;
  transactionId: string;
  skipEvent: boolean;
  userRequestId: string;
}

export type Currencies = 'USD' | 'EUR';
export type CompanyStatus = 'active' | 'inactive';

type ProductOptions = [
  ProductOptionsDescription,
  ProductOptionsPackaging
]

type ProductOptionsDescription =  {
  id: string;
  name: string;
  dataField: string | null;
  values: {
    id: string;
    name: string;
    values: string;
  }
}

type ProductOptionsPackaging = {
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
  fileName: string;
  cdnLink: string | null;
  i: number;
  alt: string | null;
}

export type ProductStatus = 'active' | 'inactive' | 'pending';
export type ProductPublishStatus = 'published' | 'unpublished';
export type ProductAvailability = 'available' | 'unavailable';
export type ProductStorefrontPriceVisibility = 'members-only' | 'all' | 'none';
