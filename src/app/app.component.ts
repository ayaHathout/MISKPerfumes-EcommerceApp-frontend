import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

   constructor(private router: Router, private viewportScroller: ViewportScroller) {
   }
  
   ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Scroll to top unless it's the /products page
      if (!event.urlAfterRedirects.startsWith('/products')) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });
  }
  
  title = 'MiskApp';
}
