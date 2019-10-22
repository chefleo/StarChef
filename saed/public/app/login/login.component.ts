import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IUser } from '../user';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage: string;

  userForm: FormGroup;
  user: IUser = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private login: UserService) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit() {
    console.log(this.userForm.value);
    this.login.login(this.userForm.value)
      .subscribe(
        res => {
          this.login.setToken(res['token']);
        },
        err => console.log(err)
      );

  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.userForm.reset();
    this.router.navigate(['/home']);
  }

    buildForm() {
      this.userForm = this.fb.group({
        email:    [this.user.email, [Validators.required, Validators.email]] ,
        password: [this.user.password, Validators.required]
      });
    }

}
