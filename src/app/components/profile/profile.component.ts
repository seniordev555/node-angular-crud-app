import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertService, UserService, AuthService } from '../../services/index';

@Component({
  selector: 'app-profile',
  moduleId: module.id,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {}
  pw: any = {}
  loadingProfile: boolean = false;
  loadingPassword: boolean = false;

  constructor(private _authService: AuthService, private _userService: UserService, private _alertService: AlertService) { }

  ngOnInit() {
    this.user = this._authService.getUserData();
  }

  saveProfile() {
    this.loadingProfile = true;
    this._userService.updateProfile(this.user)
      .subscribe(
        data => {
          this.loadingProfile = false;
          this._authService.setUserData(data);
          let message = 'Profile updated successfully.';
          this._alertService.success(message);
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._alertService.error(message);
          this.loadingProfile = false;
        }
      );
  }

  savePassword(form: NgForm) {
    this.loadingPassword = true;
    this._userService.updateOwnPassword(this.pw)
      .subscribe(
        data => {
          this.loadingPassword = false;
          let message = 'Password updated successfully.';
          this._alertService.success(message);
          form.resetForm();
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._alertService.error(message);
          this.loadingPassword = false;
        }
      );
  }

}
