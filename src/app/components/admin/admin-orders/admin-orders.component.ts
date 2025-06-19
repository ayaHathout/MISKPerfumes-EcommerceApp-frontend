import { Component, OnInit } from '@angular/core';
import { SystemOrdersService } from '../../../services/admin/system-orders.service';

interface Order {
  orderId: number,
  username: string;
  totalAmount: number;
  address: string;
  orderDate: string;
  products: { name: string; quantity: number }[];
}

@Component({
  selector: 'app-admin-orders',
  standalone: false,
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {

  orders: Order[] = [];

  currentPage = 0;
  itemsPerPage = 5;
  searchTerm = '';
  totalPages = 1;

  constructor(private orderService: SystemOrdersService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders(this.currentPage, this.itemsPerPage).subscribe(res => {
      const content = res.data.content;
      this.orders = content.map(dto => ({
        orderId: dto.orderId,
        username: dto.userName,
        totalAmount: dto.totalPrice,
        address: 'N/A',
        orderDate: new Date().toLocaleDateString(),
        products: Object.entries(dto.products).map(([name, quantity]) => ({ name, quantity })),
      }));
      this.totalPages = res.data.totalPages;
    });
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 0 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOrders();
  }


}
