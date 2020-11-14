import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";
import { Product } from "../product";
import { IUser } from "../user";

@Component({
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.css"]
})
export class UserEditComponent implements OnInit {
  userDetails;

  url: string = "http://localhost:8080";

  categories = ["Ovens", "Knife", "Slicers", "Kneading", "Other"];
  images;

  productForm: FormGroup;
  products: Array<Product> = [];
  product: Product = {
    image: null,
    person_id: "",
    name: "",
    description: "",
    category: "",
    price: null
  };
  user: IUser = {
    username: "",
    email: "",
    password: ""
  };
  editForm: FormGroup;

  constructor(
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe(res => {
      (this.userDetails = res["cust"]),
        (this.products = res["product"]),
        console.log(this.products),
        this.buildForm();
    });
  }

  onLogout() {
    this.userService.deleteToken();
    this.logoutSnackBar("Logout", "Close");
    this.router.navigate(["/login"]);
  }

  logoutSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ["logout-class"]
    });
  }

  // **************  Add Product  *****************
  addProduct() {
    console.log(this.productForm.value.image);
    this.userService
      .addProduct(
        this.productForm.value.image,
        this.productForm.value.person_id,
        this.productForm.value.name,
        this.productForm.value.description,
        this.productForm.value.category,
        this.productForm.value.price
      )
      .subscribe(
        res => {
          this.onSaveComplete(),
            this.openSnackBar("Added product", "Close"),
            console.log("product create"),
            this.reloadComponent();
        },
        err => {
          console.log(err),
            console.log("Errore from subscribe"),
            this.router.navigate(["/home"]);
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ["add-class"]
    });
  }

  // **************  Delete Product  *****************
  deleteProduct(product) {
    console.log(product._id);
    this.userService.deleteProduct(product._id).subscribe(data => {
      console.log(data);
      this.deleteSnackBar("Delete product", "Close");
      //alert('Success');
      this.reloadComponent();
    });
  }

  deleteSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ["delete-class"]
    });
  }

  // **************  Edit User  *****************
  Edit() {
    console.log(this.editForm.value);
    this.userService.putUser(this.editForm.value).subscribe(
      res => {
        this.onSaveComplete(),
          this.editSnackBar("Edited", "Close"),
          console.log("Update user"),
          this.reloadComponent();
      },
      err => console.log(err)
    );
  }

  editSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ["edit-class"]
    });
  }

  // **************  Other  *****************
  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate(["/user-edit"]);
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    // User
    this.editForm.get("username").reset();
    this.editForm.get("email").reset();
    this.editForm.get("password").reset();
    // Product
    this.productForm.get("image").reset();
    this.productForm.get("name").reset();
    this.productForm.get("description").reset();
    this.productForm.get("category").reset();
    this.productForm.get("price").reset();
  }

  buildForm() {
    //console.log(this.userDetails._id);
    this.productForm = this.fb.group({
      image: [this.product.image, Validators.required],
      person_id: [this.userDetails._id],
      name: [this.product.name, Validators.required],
      description: [this.product.description, Validators.required],
      category: [this.product.category, Validators.required],
      price: [this.product.price, Validators.required]
    });

    this.editForm = this.fb.group({
      _id: [this.userDetails._id],
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [this.user.password, Validators.required]
    });
  }

  selectImage(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.productForm.patchValue({
      image: file
    });
    this.productForm.get("image").updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }
}
