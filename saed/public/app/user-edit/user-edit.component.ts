import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Product } from '../product';
import { IUser } from '../user';

@Component({
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  userDetails;

  url: string = 'http://localhost:8080';


  categories = ['Ovens', 'Knife', 'Cooking', 'Slicers', 'Kneading'];
  images;

  productForm: FormGroup;
  products: Array<Product> = [];
  product: Product = {
    image: null,
    person_id: '',
    name: '',
    description: '',
    category: '',
    price: null
  };
  user: IUser = {
    username: '',
    email: '',
    password: ''
  };
  editForm: FormGroup;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.userService.getUser().subscribe(
      res => {
        this.userDetails = res['cust'],
        this.products = res['product'],
        console.log(this.products),
        this.buildForm();
      }
    );
  }

  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

  addProduct() {
    console.log(this.productForm.value.image);
    this.userService.addProduct(
      this.productForm.value.image,
      this.productForm.value.person_id,
      this.productForm.value.name,
      this.productForm.value.description,
      this.productForm.value.category,
      this.productForm.value.price,
    )
      .subscribe(
        res => {
          this.onSaveComplete(),
          console.log('product create'),
          this.reloadComponent();
        },
        err => {
          console.log(err),
          console.log('Errore from subscribe'),
          this.router.navigate(['/home']);
        }
      );
  }

  deleteProduct(product) {
    console.log(product._id);
    this.userService.deleteProduct(product._id).subscribe(
      data => {
        console.log(data);
        alert('Success');
        this.reloadComponent();
      }
    );
  }

  Edit() {
    console.log(this.editForm.value);
    this.userService.putUser(this.editForm.value)
      .subscribe(
        res => {
          this.onSaveComplete(),
          console.log('Update user'),
          this.reloadComponent();
        },
        err => console.log(err)
      );
  }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/user-edit']);
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    // User
    this.editForm.get('username').reset();
    this.editForm.get('email').reset();
    this.editForm.get('password').reset();
    // Product
    this.productForm.get('image').reset();
    this.productForm.get('name').reset();
    this.productForm.get('description').reset();
    this.productForm.get('category').reset();
    this.productForm.get('price').reset();
  }

  buildForm() {
    //console.log(this.userDetails._id);
    this.productForm = this.fb.group({
      image:           [this.product.image, Validators.required],
      person_id:       [this.userDetails._id],
      name:            [this.product.name, Validators.required],
      description:     [this.product.description, Validators.required],
      category:        [this.product.category, Validators.required],
      price:           [this.product.price, Validators.required]
    });

    this.editForm = this.fb.group({
      _id:      [this.userDetails._id],
      username: [this.user.username, Validators.required],
      email:    [this.user.email, [Validators.required, Validators.email]] ,
      password: [this.user.password, Validators.required]
    });
  }

  selectImage(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.productForm.patchValue({
      image: file
    });
    this.productForm.get('image').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }
}
