import { Component,ElementRef,ViewChild } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Address } from '../../models/Address';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  selectedTab = 'account';

  // For personal tab
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  isEditMode: boolean = false;
  isEditingForCredit: boolean = false;
  showUpdateMessage: boolean = false;
  toastSuccess: boolean = false;
  toastMessage: string = '';
  @ViewChild('toastElement') toastElement!: ElementRef;

  // For Address tab
  addresses: Address[] = [];
  showAddressForm = false;

  // For credit limit
  creditLimit: string = '';

  // For change password
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // For validations
  emailError: string = '';

  constructor (private profileService: ProfileService, private validationService: ValidationService) {}

  ngOnInit() {
    this.getPersonalInfo();
  }
 
  // For personal tab
  getPersonalInfo(): void {
    this.profileService.getPersonalInfo1().subscribe({
      next: (res) => {
        console.log("ressssssssssss: " + res);
        console.log("fname: " + res.name);
        console.log("email: " + res.email);
        console.log("phone: " + res.phoneNumber);
        console.log("useraddress: " + res.useraddress);
        console.log("creditLimit: " + res.creditLimit);

        this.name = res.name;
        this.email = res.email;
        this.phoneNumber = res.phoneNumber;
        this.addresses = res.useraddress || [];
        this.creditLimit = res.creditLimit
      },
      error: (err) => {
        console.error('Error fetching personal info:', err);
      }
    });
  }

   enableEdit(): void {
    this.isEditMode = true;
    this.isEditingForCredit = true;
  }

  saveChanges(): void {
    const updatedInfo = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      creditLimit: this.creditLimit
    };

  this.profileService.updatePersonalInfo(updatedInfo).subscribe({
    next: (res) => {
      console.log("Response from update:", res);
      this.isEditMode = false;
      this.isEditingForCredit = false;
      this.showUpdateMessage = true;

      setTimeout(() => {
        this.showUpdateMessage = false;
      }, 3000);
    },
    error: (err) => {
      console.error('Error updating personal info:', err);
      this.showToast(false,JSON.stringify(err));
    }
  });
  }

  // For address tab
  newAddress: Address = {
    addressId: '',
    state: '',
    city: '',
    street: '',
    departmentNumber: ''
  };

  addAddress() {
    this.showAddressForm = true;
    this.newAddress = {
        addressId: '',
        state: '',
        city: '',
        street: '',
        departmentNumber: ''
    };
  }

  /* saveAddress() {
    if (this.newAddress.state && this.newAddress.city && this.newAddress.street) {
      const addressesToSend = [this.newAddress];

      this.profileService.addNewAddress(addressesToSend).subscribe({
        next: (res) => {
          console.log("Address added:", res);
          alert("Address added successfully!");

          // Add to local array and reset form
          this.addresses.push({ ...this.newAddress });
          this.showAddressForm = false;
        },
        error: (err) => {
          console.error("Error adding address:", err);
          alert("Failed to add address. Please try again.");
        }
      });
    } 
    else alert('Please fill in all required fields.');
  } */

  cancelAddress() {
    this.showAddressForm = false;
  } 

   saveAddress() {
    if (this.newAddress.state && this.newAddress.city && this.newAddress.street) {
      const { addressId, ...addressWithoutId } = this.newAddress;
      const addressesToSend = [addressWithoutId];

      this.profileService.addNewAddress(addressesToSend).subscribe({
        next: (res) => {
          console.log("Address added:", res);
          this.showToast(true,"Address added successfully!");
          
          this.getPersonalInfo();
          this.showAddressForm = false;
        },
        error: (err) => {
          console.error("Error adding address:", err);
         this.showToast(false,"Failed to add address. Please try again.");
        }
      });
    } 
    else  this.showToast(false,'Please fill in all required fields.');
}


  deleteAddress(index: number): void {
     const addressId = this.addresses[index].addressId;

     if (!addressId) {
        this.showToast(false,"This address cannot be deleted because it has no ID.");
        return;
    }

    if (confirm("Are you sure you want to delete this address?")) {
      this.profileService.deleteAddress(+addressId).subscribe({
        next: () => {
          this.addresses.splice(index, 1); 
          this.showToast(true,"Address deleted successfully.");
        },
        error: (err) => {
          console.error("Error deleting address:", err);
          this.showToast(false,"Failed to delete address. Please try again.");
        }
      });
    }
  }

  // For credit limit
   toggleEdit() {
    if (this.isEditingForCredit)  this.saveChanges(); 
    this.isEditingForCredit = !this.isEditingForCredit; 
  }

  // For change password
  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.showToast(false,"New passwords do not match!");
      return;
    }

    this.profileService.changePassword(this.oldPassword, this.newPassword).subscribe({
        next: (response) => {
          if (response.success) {
            this.showUpdateMessage = true;
            setTimeout(() => this.showUpdateMessage = false, 3000);
          } 
          else  this.showToast(false,'Error: ' + response.message);
        },
        error: (err) => {
          this.showToast(false,'Something went wrong.');
          console.error(err);
        }
    });
  }

    // For validations
     onEmailChange() {
      if (!this.validationService.isEmailValid(this.email)) {
        this.emailError = 'Please enter a valid email address';
      } else {
        this.emailError = '';
      }
     }
  
   private showToast(success: boolean, message: string): void {
    this.toastSuccess = success;
    this.toastMessage = message;

    setTimeout(() => {
      if (this.toastElement?.nativeElement) {
        const toast = new (window as any).bootstrap.Toast(this.toastElement.nativeElement);
        toast.show();
      }
    }, 100);
  }

}
