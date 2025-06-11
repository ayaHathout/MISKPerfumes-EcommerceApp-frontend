import { Component, ViewChild,ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  toastSuccess: boolean = false;
  toastMessage: string = '';
  @ViewChild('toastElement') toastElement!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.success && res.data?.token) {
          this.authService.saveToken(res.data.token, res.data.role);
          console.log('Login Response:', res);
          console.log('Role:', res.data.role);

          const redirect = this.authService.getRedirectUrl();
          if (redirect) {
            this.authService.clearRedirectUrl();
            this.router.navigateByUrl(redirect).catch(err => console.error('Redirect error:', err));
          }
          else {
            // 👇 Redirect based on role
          if (res.data.role === 'ADMIN') {
            this.router.navigate(['/admin/users']);
          } else {
            this.router.navigate(['/home']);
          }
          }  
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        this.showToast(false,'Invalid email or password!');
      },
    });
  }

  showPassword: boolean = false;
  togglePasswordVisibility(field: 'password') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
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
