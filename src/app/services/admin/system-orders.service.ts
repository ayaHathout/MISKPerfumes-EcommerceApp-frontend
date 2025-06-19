import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface OrderDto {
  orderId: number;
  userName: string;
  totalPrice: number;
  products: { [name: string]: number };
}

interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class SystemOrdersService {
  

  private baseUrl = 'http://localhost:8085/admin/orders'; 
  constructor(private http: HttpClient) { }

  getOrders(page: number, size: number): Observable<ApiResponse<PagedResponse<OrderDto>>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<ApiResponse<PagedResponse<OrderDto>>>(this.baseUrl, { params });
  }
}
