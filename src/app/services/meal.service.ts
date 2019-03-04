import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MealService {

  constructor(private _http: Http, private _authService: AuthService) { }

  getAll() {
    return this._http.get(environment.apiUrl + '/meals/all', this.jwt()).map((response: Response) => response.json());
  }

  getMealsByUser() {
    return this._http.get(environment.apiUrl + '/meals', this.jwt()).map((response: Response) => response.json());
  }

  getMealById(id: string) {
    return this._http.get(environment.apiUrl + '/meals/' + id, this.jwt()).map((response: Response) => response.json());
  }

  create(meal) {
    return this._http.post(environment.apiUrl + '/meals', meal, this.jwt()).map((response: Response) => response.json());
  }

  update(meal) {
    return this._http.put(environment.apiUrl + '/meals/' + meal._id, meal, this.jwt()).map((response: Response) => response.json());
  }

  destroy(meal) {
    return this._http.delete(environment.apiUrl + '/meals/' + meal._id, this.jwt()).map((response: Response) => response.json());
  }

  // private helper methods

  private jwt() {
    // create authorization header with jwt token
    let authData = this._authService.getAuthData();
    if (authData && authData.token) {
      let headers = new Headers({ 'Authorization': 'JWT ' + authData.token });
      return new RequestOptions({ headers: headers });
    }
  }
}
