import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/admin/products.service';

interface Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  gender: string;
  size: string;
  // imageUrl: string;
}

@Component({
  selector: 'app-admin-product-add',
  standalone: false,
  templateUrl: './admin-product-add.component.html',
  styleUrl: './admin-product-add.component.css'
})
export class AdminProductAddComponent implements OnInit{

  selectedPhotoFile?: File;
  imageUrl:String = "https://via.placeholder.com/100";

  product: Product = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    brand: '',
    gender: '',
    size: '',
    // imageUrl: 'https://via.placeholder.com/100'
  };

  constructor(private router: Router, private productsService:ProductsService) {}

    
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    // Initialze
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, or GIF)');
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      this.selectedPhotoFile = file; // Save for upload

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imageUrl = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveProduct(): void {
    // Call your service to add product
    this.productsService.addProduct(this.product, this.selectedPhotoFile)
      .subscribe({
        next: (createdProduct) => {
          alert(`Product "${createdProduct.name}" has been created successfully!`);
          this.router.navigate(['admin/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Failed to create product. Please try again.');
        }
      });
  }

  goBack(): void {
    const hasData = this.product.name || this.product.description ||
                    this.product.price > 0 || this.product.quantity > 0;

    if (hasData) {
      const confirmLeave = confirm(
        'You have unsaved data. Are you sure you want to leave this page?'
      );
      if (!confirmLeave) return;
    }

    this.router.navigate(['admin/products']);
  }

  // onImageSelected(event: Event): void {
  //   const target = event.target as HTMLInputElement;
  //   const file = target.files?.[0];
    
  //   if (file) {
  //     // Validate file type
  //     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  //     if (!allowedTypes.includes(file.type)) {
  //       alert('Please select a valid image file (JPG, PNG, or GIF)');
  //       return;
  //     }

  //     // Validate file size (max 5MB)
  //     const maxSize = 5 * 1024 * 1024;
  //     if (file.size > maxSize) {
  //       alert('File size must be less than 5MB');
  //       return;
  //     }

  //     // Convert to base64 for preview
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       if (e.target?.result) {
  //         this.product.imageUrl = e.target.result as string;
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // saveProduct(): void {
  //   // TODO: Replace with actual service call
  //   // For now, just show success message
    
  //   console.log('New Product to save:', this.product);
    
  //   // Simulate API call
  //   setTimeout(() => {
  //     alert(`Product "${this.product.name}" has been created successfully!`);
  //     this.router.navigate(['/products']);
  //   }, 500);
  // }

  // goBack(): void {
  //   // Check if form has data before leaving
  //   const hasData = this.product.name || this.product.description || 
  //                  this.product.price > 0 || this.product.quantity > 0;
    
  //   if (hasData) {
  //     const confirmLeave = confirm(
  //       'You have unsaved data. Are you sure you want to leave this page?'
  //     );
  //     if (!confirmLeave) return;
  //   }
    
  //   this.router.navigate(['/products']);
  // }

}
