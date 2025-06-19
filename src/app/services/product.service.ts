import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ProductDto, ApiResponse } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8085/public/products';

  constructor(private http: HttpClient) {}

  getFilteredProducts(filters: { 
    name?: string; 
    minPrice: number; 
    maxPrice: number; 
    brands?: string[]; 
    page: number; 
    pageSize: number; 
    gender?: string 
  }): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('name', filters.name || '')
      .set('minPrice', filters.minPrice.toString())
      .set('maxPrice', filters.maxPrice.toString())
      .set('page', filters.page.toString())
      .set('size', filters.pageSize.toString());

    // optional
    if (filters.gender) {
      params = params.set('gender', filters.gender.toLowerCase());
    }
    if (filters.brands && filters.brands.length > 0) {
      params = params.set('brands', filters.brands.join(','));
    }

    console.log('Fetching products with query params:', params.toString());

    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<ProductDto>(`${this.apiUrl}/${id}`).pipe(
      map((product: ProductDto) => ({
        id: product.productId,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        brand: product.brand,
        size: product.size,
        gender: product.gender.toLowerCase(),
        imageUrl: product.photo
      }))
    );
  }

  getTrendingProducts(): Observable<Product[]> {
    let params = new HttpParams()
      .set('page', '0')
      .set('size', '8');

    return this.http.get<ApiResponse>(this.apiUrl, { params }).pipe(
      map((response: ApiResponse) => 
        response.data.content.map(p => ({
          id: p.productId,
          name: p.name,
          description: p.description,
          price: p.price,
          quantity: p.quantity,
          brand: p.brand,
          size: p.size,
          gender: p.gender.toLowerCase(),
          imageUrl: p.photo
        }))
      )
    );
  }
}
