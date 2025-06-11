import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckOutService } from '../../services/checkout.service';


@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  standalone: false,
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {
  selectedAddressId: number | null = null;
  
  // isSuccess: boolean = true;
  message: string = 'Your order has been successfully placed. You should expect delivery within 3 days.';
  imageSrc: string = 'img/order_confirmed.png';
  title: string = 'Thank You for Your Purchase!';
  isSuccess: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private checkout: CheckOutService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      console.log('Received query params:', params);
      this.selectedAddressId = params['addressId'] ? +params['addressId'] : null;
      this.message = params['message'] || this.message;
      this.isSuccess = params['isSuccess'] === 'true';

      if (!this.isSuccess) {
        this.setErrorState(this.message);
      }
    });

    console.log(this.selectedAddressId);

  }

  setErrorState(msg: string): void {
    this.isSuccess = false;
    this.message = msg;
    this.imageSrc = 'img/issue.png';
    this.title = 'The winds do not blow as the ships wish';
  }

  homeNavigate(): void {
    const redirect = this.checkout.getRedirectUrl();
    if (redirect) {
      this.checkout.clearRedirectUrl();
      this.router.navigateByUrl(redirect).catch(err => console.error('Redirect error:', err));
    }
    else {
       this.router.navigate(['home']);
    }
  }

}