import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Product } from '../product';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  url: string = 'http://localhost:8080';

  products: Product[];

  orderForm: FormGroup;

  product: string;
  quantity: number;

  userId: string;

  isLoggedIn = this.userService.isLoggedIn();

  constructor(private userService: UserService, private router: Router, config: NgbCarouselConfig, private fb: FormBuilder) {
    // customize default values of carousels used by this component tree
    config.interval = 4000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.wrap = true;

    this.orderForm = this.fb.group({
      product: ['', [Validators.required]],
      quantity: [1, [Validators.required]]
    });
   }

  ngOnInit() {
    if (!this.isLoggedIn) {
      this.userService.deleteToken();
    }
    this.userService.getProducts().subscribe(
      res => {
        if(this.isLoggedIn === true){
          this.userId = res['user']
        }
        this.products = res['product'];
      }
    );
  }

  orderProduct(product, quantity) {
    console.log(this.userId);
    console.log(product._id, product.name);
    console.log(this.orderForm.value.quantity);
  }

  getProduct(product) {
    return product._id;
  }

}
