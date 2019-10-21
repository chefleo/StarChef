import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RegisterService } from './register.service';
import { IUser } from '../user';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  errorMessage: string;

  userForm: FormGroup;
  user: IUser = {
    username: '',
    email: '',
    password: ''
  };

  /*form = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email] ),
    password: new FormControl('', Validators.required)
  });*/

  constructor(private router: Router,
              private route: ActivatedRoute,
              private registerService: RegisterService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit() {
    // alert(JSON.stringify(this.form.controls.username.value));

    console.log(this.userForm.value);
    /*
    const p = { ...this.user, ...this.userForm.value };

    // tslint:disable-next-line: no-unused-expression
    this.registerService.createUser(p)
      .subscribe((user: IUser) => {
        // tslint:disable-next-line: no-unused-expression
        next: () => this.onSaveComplete();
        error: err => this.errorMessage = err;
      }
    ); */

    this.registerService.createUser(this.userForm.value)
      .subscribe(
        (data: IUser) => console.log(data),
        (err: any) => console.log(err)
      );

    this.onSaveComplete();
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.userForm.reset();
    this.router.navigate(['/home']);
  }

  buildForm() {
    this.userForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email:    [this.user.email, [Validators.required, Validators.email]] ,
      password: [this.user.password, Validators.required]
    });
  }

}
