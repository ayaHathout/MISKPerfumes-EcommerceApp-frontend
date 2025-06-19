import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDto, ProductsService } from '../../../services/admin/products.service';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
  gender: string;
  size: string;
  imageUrl: string;
}

interface FieldChange {
  field: string;
  oldValue: any;
  newValue: any;
}

@Component({
  selector: 'app-admin-product-edit',
  standalone: false,
  templateUrl: './admin-product-edit.component.html',
  styleUrl: './admin-product-edit.component.css'
})
export class AdminProductEditComponent implements OnInit {

  productId!: number;
  product: ProductDto | null = null;
  originalProduct: ProductDto | null = null;
  changedFields: { [key: string]: { oldValue: any; newValue: any } } = {};
  photoFile: File | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private productsService:ProductsService) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

  this.productsService.getProductById(this.productId).subscribe({
    next: (data) => {
      this.product = data;
      this.originalProduct =JSON.parse(JSON.stringify(data));
    },
    error: (err) => {
      console.error('Error fetching product', err);
      alert('Error fetching product');
    }
  });
  }

  // When user upload new photo
  onImageSelected(event: Event): void {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    } 

    // Set the file
    this.photoFile = file;

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (this.product && e.target?.result) {
        const oldImageUrl = this.product.photo;
        this.product.photo = e.target.result as string;

        this.trackChange('photo', this.product.photo, oldImageUrl);
      }
    };
    reader.readAsDataURL(file);
  }
}

trackChange(field: string, newValue: any, oldValue?: any): void {
    if (!this.originalProduct) return;

    const originalValue = oldValue !== undefined ? oldValue : (this.originalProduct as any)[field];
    
    if (newValue !== originalValue) {
      this.changedFields[field] = { oldValue: originalValue, newValue };
    } else {
      // If value is reverted to original, remove from changed fields
      delete this.changedFields[field];
    }
  }

  hasChanges(): boolean {
    return Object.keys(this.changedFields).length > 0;
  }

  preparePatchPayload(): any {
  const dto: any = {};

  for (const field in this.changedFields) {
    const value = (this.product as any)[field];
    if (field === 'photo') continue; // handled as File separately
    dto[field] = (this.product as any)[field];
  }

  return dto;
  
  }

  saveProduct(): void {
  if (!this.product || !this.hasChanges()) {
    alert('No changes to save.');
    return;
  }

  const patchData = this.preparePatchPayload();

  this.productsService.patchProduct(this.productId, patchData, this.photoFile ?? undefined)
    .subscribe({
      next: (updatedProduct) => {
        alert(`Product "${updatedProduct.name}" updated successfully.`);
        this.router.navigate(['admin/products']);
      },
      error: (err) => {
        console.error('Error updating product:', err);
        alert('Failed to update product');
      }
    });
}

goBack(): void {
    if (this.hasChanges()) {
      const confirmLeave = confirm(
        'You have unsaved changes. Are you sure you want to leave this page?'
      );
      if (!confirmLeave) return;
    }
    
    this.router.navigate(['admin/products']);
  }

  resetForm(): void {
    if (this.originalProduct) {
      this.product = { ...this.originalProduct };
      this.changedFields = {};
    }
  }
   // Optional: get readable field names if needed in a confirmation popup
  getChangedFieldsForDisplay(): { field: string; oldValue: any; newValue: any }[] {
    const fieldNames: { [key: string]: string } = {
      name: 'Product Name',
      description: 'Description',
      price: 'Price',
      quantity: 'Quantity',
      brand: 'Brand',
      gender: 'Gender',
      size: 'Size',
      photo: 'Product Image'
    };
    return Object.entries(this.changedFields).map(([field, change]) => ({
      field: fieldNames[field] || field,
      oldValue: change.oldValue,
      newValue: change.newValue
    }));
  }
}