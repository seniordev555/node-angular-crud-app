import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isCollapsed:boolean = true;
  isUserAuthorized: boolean = false;
  currentUser: User;
  title = 'app';

  constructor(private _router: Router, private _authService: AuthService) {
    this._router.events.subscribe(() => {
      this.isUserAuthorized = this._authService.isUserAuthorized();
      this.currentUser = this._authService.getUserData();
    });
  }

  ngOnInit() {

  }

  logout() {
    this._authService.logout();
    this._router.navigateByUrl('/login');
  }

  ngOnDestroy() {
  }

}
