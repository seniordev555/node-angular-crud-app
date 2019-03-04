import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user.model';
import { Meal } from '../../models/Meal.model';
import { UserService, AuthService, MealService, AlertService } from '../../services/index';

@Component({
  selector: 'app-dashboard',
  moduleId: module.id,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  filteredMeals: any[] = [];
  mealFilters: any = {};
  currentUser: User;

  private _meals: Meal[] = [];

  constructor(private _userService: UserService, private _authService: AuthService, private _mealService: MealService, private _alertService: AlertService) {
    this.mealFilters = {
      fromDate: '',
      toDate: '',
      fromTime: '',
      toTime: ''
    };
  }

  ngOnInit() {
    this.getCurrentUserProfile();
  }

  filterMeals() {
    this.filteredMeals = this.groupMeals(this._meals);
  }

  deleteMeal(meal) {
    if(!confirm('Would you like to delete this meal?')) return;
    this._mealService.destroy(meal)
      .subscribe(
        data => {
          this.getMeals();
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

  private getCurrentUserProfile() {
    this.currentUser = this._authService.getUserData();
    this.getMeals();
  }

  private getMeals() {
    this._mealService.getMealsByUser().subscribe(
      meals => {
        this._meals = meals;
      this.filteredMeals = this.groupMeals(this._meals);
      },
      error => {
        error = error.json();
        let message = error.message || 'Something went wrong, please try again.';
        this._alertService.error(message);
      }
    );
  }

  private groupMeals(meals) {
    let grouped = {}, totalCalories = {};
    for(let meal of meals) {
      let flag = !((this.mealFilters.fromDate != '' && meal.date < this.mealFilters.fromDate)
              || (this.mealFilters.toDate != '' && meal.date > this.mealFilters.toDate)
              || (this.mealFilters.fromTime != '' && meal.time < this.mealFilters.fromTime)
              || (this.mealFilters.toTime != '' && meal.time > this.mealFilters.toTime));
      if(flag) {
        if(!grouped[meal.date]) {
          grouped[meal.date] = [meal];
        } else {
          grouped[meal.date].push(meal);
        }
      }
      if(!totalCalories[meal.date]) totalCalories[meal.date] = meal.calories;
      else totalCalories[meal.date] += meal.calories;
    }
    return Object.keys(grouped).map(key => ({ key, value: grouped[key], total: totalCalories[key] }));
  }

}
