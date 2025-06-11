export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  gender: string;
  size: string;
  imageUrl: string;
}

export interface ProductDto {
  productId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  photo: string;
  brand: string;
  size: string;
  gender: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    content: ProductDto[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
}