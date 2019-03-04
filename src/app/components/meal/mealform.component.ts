import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MealService, AlertService, AuthService, UserService } from '../../services/index';
import { Meal } from '../../models/meal.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-meal-form',
  moduleId: module.id,
  templateUrl: './mealform.component.html'
})
export class MealFormComponent implements OnInit, OnDestroy {
  id: string;
  meal: any = {};
  loading: boolean = false;
  users: any[] = [];
  currentUser: User;

  private _sub: any;

  constructor(private _route: ActivatedRoute, private _mealService: MealService, private _router: Router, private _alertService: AlertService, private _authService: AuthService, private _userService: UserService) { }

  ngOnInit() {
    this._sub = this._route.params.subscribe(params => {
      this.id = params['id'];
      this.currentUser = this._authService.getUserData();
      if(this.currentUser.role == 'admin') this.getAllUsers();
      if(this.id) this.getMealById();
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

  save() {
    this.loading = true;
    (this.id ? this._mealService.update(this.meal) : this._mealService.create(this.meal))
      .subscribe(
        data => {
          this.loading = false;
          let message = this.id ? 'Meal updated successfully.' : 'Meal created successfully.';
          this._alertService.success(message, true);
          this._router.navigate(['/meals']);
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._alertService.error(message);
          this.loading = false;
        }
      );
  }

  private getMealById() {
    this._mealService.getMealById(this.id).subscribe(
      meal => {
        this.meal = meal;
      },
      error => {
        error = error.json();
        let message = error.message || 'Something went wrong, please try again.';
        this._alertService.error(message, true);
        this._router.navigate(['/meals']);
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
        this._alertService.error(message, true);
        this._router.navigate(['/meals']);
      }
    );
  }

}
