import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Product } from '../product';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[];

  constructor(private userService: UserService, private router: Router, config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 4000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.wrap = true;
   }

  ngOnInit() {
    this.userService.getProducts().subscribe(
      res => {
        this.products = res['product'];
      }
    );
  }

}
