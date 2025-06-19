import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductDto {
  productId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  gender: string;
  size: string;
  photo: string; // this is your imageUrl
}

export interface ProductResponse {
  content: ProductDto[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page
}


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:8085/admin/products';

  constructor(private http: HttpClient) { }

  // Get all non-deleted Products
  getProducts(page: number, size: number, searchTerm: string): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('isDeleted', false)


    if (searchTerm) {
      params = params.set('name', searchTerm);
    }

    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  // Get Product detail for this Product
  getProductById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`http://localhost:8085/public/products/${id}`);
  }

  // Edit product just with specific changes
  patchProduct(id: number, changedFields: any, photoFile?: File): Observable<ProductDto> {
    const formData = new FormData();

    // JSON.stringify the changed fields (dto-style object)
    formData.append('product', JSON.stringify(changedFields));

    // Append photo if changed
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    return this.http.patch<ProductDto>(`${this.apiUrl}/${id}`, formData);
  }


  // Delete Product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Add new Product
  addProduct(product: any, photoFile?: File): Observable<ProductDto> {
  const formData = new FormData();

  // Append product JSON as a string part
  formData.append('product', JSON.stringify(product));

  // Append photo file if exists
  if (photoFile) {
    formData.append('photo', photoFile);
  }

  return this.http.post<ProductDto>(this.apiUrl, formData);
}


}
