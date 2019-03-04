import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user.model';
import { Meal } from '../../models/Meal.model';
import { UserService, AuthService, MealService, AlertService } from '../../services/index';

@Component({
  selector: 'app-meal',
  moduleId: module.id,
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  meals: Meal[] = [];

  constructor(private _mealService: MealService, private _alertService: AlertService) { }

  ngOnInit() {
    this.getAllMeals();
  }

  deleteMeal(meal) {
    if(!confirm('Would you like to delete this meal?')) return;
    this._mealService.destroy(meal)
      .subscribe(
        data => {
          this.getAllMeals();
          let message = 'Meal deleted successfully.';
          this._alertService.success(message);
        },
        error => {
          error = error.json();
          let message = error.message || 'Something went wrong, please try again.';
          this._alertService.error(message);
        }
      );
  }

  private getAllMeals() {
    this._mealService.getAll().subscribe(
      meals => {
        this.meals = meals;
      },
      error => {
        error = error.json();
        let message = error.message || 'Something went wrong, please try again.';
        this._alertService.error(message);
      }
    );
  }

}
