export interface PropertyDto {
  id: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  imageUrl: string;
}

export interface PropertyDetailDto {
  id: string;
  name: string;
  address: string;
  price: number;
  codeInternal: string;
  year: number;
  owner: {
    id: string;
    name: string;
    photo: string;
  };
  images: {
    id: string;
    file: string;
    enabled: boolean;
  }[];
  traces: {
    id: string;
    name: string;
    dateSale: string;
    value: number;
    tax: number;
  }[];
}