import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, AlertService } from '../../services/index';

@Component({
  selector: 'app-register',
  moduleId: module.id,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  model: any = {};
  loading = false;

  constructor(private _router: Router, private _alertService: AlertService, private _userService: UserService) { }

  register() {
    this.loading = true;
    this._userService.register(this.model)
      .subscribe(
        data => {
          this._alertService.success('User registered successfully.', true);
          this._router.navigate(['/login']);
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._alertService.error(message);
          this.loading = false;
        });
  }

}
