import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService, AuthService } from '../../services/index';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user',
  moduleId: module.id,
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  currentUser: User;

  constructor(private _router: Router, private _userService: UserService, private _alertService: AlertService, private _authService: AuthService) { }

  ngOnInit() {
    this.currentUser = this._authService.getUserData();
    this.getAllUsers();
  }

  deleteUser(user) {
    if(!confirm('Would you like to delete this user?')) return;
    this._userService.destroy(user)
      .subscribe(
        data => {
          this.getAllUsers();
          let message = 'User deleted successfully.';
          this._alertService.success(message);
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._alertService.error(message);
        }
      );
  }

  private getAllUsers() {
    this._userService.getAll().subscribe(
      users => {
        this.users = users;
      },
      error => {
        error = error.json();
        let message = error.message || 'Something went wrong, please try again.';
        this._alertService.error(message);
      }
    );
  }

}
