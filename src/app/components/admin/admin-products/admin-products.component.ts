import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDto, ProductsService } from '../../../services/admin/products.service';

interface Product {
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

declare var $: any;

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit{

  products: ProductDto[] = [];
  // filteredProducts: Product[] = [];
  // paginatedProducts: Product[] = [];
  currentPage = 0;  ///Backend
  itemsPerPage = 5;
  searchTerm = '';
  totalPages = 0;

  successMessage: string | null = null;
  noResultsFound = false;
  errorMessage: string = '';
  loading = false;



  constructor(private router: Router, private productsService:ProductsService) {}


  ngOnInit(): void {
   // mock products
    // this.products = Array.from({ length: 25 }).map((_, i) => ({
    //   id:i+1,
    //   name: `Perfume ${i + 1}`,
    //   description: 'Luxury perfume',
    //   price: 150 + i,
    //   quantity: 10 + i,
    //   brand: 'MISK',
    //   gender: i % 2 === 0 ? 'male' : 'female',
    //   size: '100ml',
    //   imageUrl: 'https://via.placeholder.com/60',
    // }));

    // this.filteredProducts = [...this.products];
    // this.updatePagination();

     this.loadProducts();
  }

  loadProducts(): void {
    // this.loading = true;
    this.productsService.getProducts(this.currentPage, this.itemsPerPage, this.searchTerm)
      .subscribe({
        next: (response) => {
        this.products = response.content;
        this.totalPages = response.totalPages;
        this.noResultsFound = this.products.length === 0;
        this.errorMessage = '';  // Reset error if successful
        this.loading = false;
      },
    error: (err) => {
      console.error(err);
      this.errorMessage = 'Something went wrong while fetching products. Please try again.';
      this.loading = false;
      // setTimeout(() => (this.successMessage = null), 2000);

    }
  
  });
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  filterProducts(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

   confirmDelete(product: ProductDto): void {
  const confirmDelete = window.confirm(`Are you sure you want to delete ${product.name}? with id ${product.productId}`);
  if (confirmDelete) {
    this.productsService.deleteProduct(product.productId).subscribe({
      next: () => {
        this.successMessage = 'Deleted successfully.';
        this.loadProducts(); // Reload the list to reflect the deletion
        setTimeout(() => (this.successMessage = null), 2000);
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Delete failed. Please try again.');
      }
    });
  }
}


  editProduct(product: ProductDto) {
    this.router.navigate(['admin/products', product.productId, 'edit']);
  }

  addNewProduct(): void {
    this.router.navigate(['admin/products/add']);
  }


}
