import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Product } from '../product';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilterPipe } from '../filter.pipe';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  url: string = 'http://localhost:8080';
  events: string[] = [];
  opened = false;
  term: string;

  products: Product[];
  productsCopy: Product[];

  orderForm: FormGroup;

  product: string;
  quantity: number;

  userId;

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
        this.productsCopy = this.products;
      }
    );
  }

  orderProduct(product, quantity) {
    console.log(this.userId);
    console.log(product._id, product.name);
    console.log(this.orderForm.value.quantity);
    this.userService.postOrder(this.userId, product._id, this.orderForm.value.quantity)
          .subscribe(
            res => {
              console.log('Order create');
              alert('Order create');
            });
  }

  getProduct(product) {
    return product._id;
  }

  search(category) {
    this.term = '';
    this.products = this.productsCopy;
    return this.products = this.products.filter( res => {
      return res.category.includes(category);
    });
  }

  reset() {
    this.products = this.productsCopy;
  }

}
