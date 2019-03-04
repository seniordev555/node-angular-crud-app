import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService, UserService, AuthService } from '../../services/index';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-userform',
  moduleId: module.id,
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
  id: String;
  user: any = {};
  loading: boolean = false;
  currentUser: User;
  roles: string[] = ['user', 'manager', 'admin'];

  private _sub: any;

  constructor(private _route: ActivatedRoute, private _router: Router, private _alertService: AlertService, private _userService: UserService, private _authService: AuthService) { }

  ngOnInit() {
    this._sub = this._route.params.subscribe(params => {
      this.id = params['id'];
      this.currentUser = this._authService.getUserData();
      if(this.id) this.getUserById();
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  save() {
    this.loading = true;
    (this.id ? this._userService.update(this.user) : this._userService.create(this.user))
      .subscribe(
        data => {
          this.loading = false;
          let message = this.id ? 'User updated successfully.' : 'User created successfully.';
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

  private getUserById() {
    this._userService.getUserById(this.id).subscribe(
      user => {
        this.user = user;
      },
      error => {
        error = error.json();
        let message = error.message || 'Something went wrong, please try again.';
        this._alertService.error(message, true);
        this._router.navigate(['/users']);
      }
    );
  }
}
