import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Product } from '../product';
import { Order } from '../order';
import { timeInterval } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  order: Order[];
  totalsingleorder = 0;
  totalorder: number = 0;

  constructor(private userService: UserService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.userService.getOrders().subscribe(
      res => {
        this.order = res['order'];
        console.log(this.order);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.order.length; i++) {

          if (this.order[i].product === null ){
            this.deleteOrder(this.order[i]);
          } else {
            this.totalorder += this.order[i].product.price * this.order[i].quantity;
            console.log(this.totalorder);
          }
        }
      }
    );

  }

  deleteOrder(order) {
    console.log(order._id);
    this.userService.deleteOrder(order._id).subscribe(
      data => {
        console.log(data);
        this.deleteSnackBar('Delete Order', 'Close');
        this.reloadComponent();
      }
    );
  }

  deleteSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['delete-class']
    });
  }

  payment() {
    this.userService.payment().subscribe(
      data => {
        this.paySnackBar('Orders Accepted', 'Close'),
        this.reloadComponent();
      }
    )
  }

  paySnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['pay-class']
    });
  }

  reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/user-edit/orders']);
  }
}
