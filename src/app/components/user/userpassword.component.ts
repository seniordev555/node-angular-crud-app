import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService, AuthService, UserService } from '../../services/index';

@Component({
  selector: 'app-userpassword',
  moduleId: module.id,
  templateUrl: './userpassword.component.html'
})
export class UserPasswordComponent implements OnInit, OnDestroy {
  id: String;
  user: any = {};
  loading: boolean = false;

  private _sub: any;

  constructor(private _route: ActivatedRoute, private _router: Router, private _alertService: AlertService, private _userService: UserService) { }

  ngOnInit() {
    this._sub = this._route.params.subscribe(params => {
      this.id = params['id'];
      this.user._id = this.id;
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  save() {
    this.loading = true;
    this._userService.updatePassword(this.user)
      .subscribe(
        data => {
          this.loading = false;
          let message = 'Password updated successfully.';
          this._alertService.success(message, true);
          this._router.navigate(['/users']);
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
