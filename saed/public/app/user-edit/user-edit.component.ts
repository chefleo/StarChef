import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Product } from '../product';

@Component({
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  userDetails;
  userId: string;

  productForm: FormGroup;
  products: Product[];
  product: Product = {
    person_id: '',
    name: '',
    description: '',
    price: null
  };

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.userService.getUser().subscribe(
      res => {
        this.userDetails = res['cust'],
        this.products = res['product'],
        console.log(this.products),
        this.buildForm(),
        console.log(this.userDetails._id),
        console.log(this.userDetails);
      }
    );
    //this.buildForm();
  }

  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

  addProduct() {
    console.log(this.productForm.value);
    this.userService.addProduct(this.productForm.value)
      .subscribe(
        res => {
          this.onSaveComplete(),
          console.log('product create');
        },
        err => console.log(err)
      );
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.productForm.get('name').reset();
    this.productForm.get('description').reset();
    this.productForm.get('price').reset();
  }

  buildForm() {
    console.log(this.userDetails._id);
    this.productForm = this.fb.group({
      person_id:       [this.userDetails._id],
      name:            [this.product.name, Validators.required],
      description:     [this.product.description, Validators.required],
      price:           [this.product.price, Validators.required]
    });
  }
}
