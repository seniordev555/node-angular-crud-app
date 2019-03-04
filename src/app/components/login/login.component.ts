import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService, AlertService, UserService } from '../../services/index';

@Component({
  selector: 'app-login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _authService: AuthService, private _alertService: AlertService, private _userService: UserService) { }

  ngOnInit() {
    // reset login status
    this._authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this._authService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          this._userService.getProfile().subscribe(
            user => {
              this._authService.setUserData(user);
              this._router.navigate([this.returnUrl]);
            },
            error => {
              error = error.json();
              let message = error.message || 'Something went wrong, please try again.';
              this._alertService.error(message);
              this.loading = false;
            }
          );
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._alertService.error(message);
          this.loading = false;
        }
      );
  }

}
