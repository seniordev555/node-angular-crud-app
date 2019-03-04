import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class UserService {
  constructor(private _http: Http, private _authService: AuthService) { }

  getProfile() {
    return this._http.get(environment.apiUrl + '/users/profile', this.jwt()).map((response: Response) => response.json());
  }

  register(user) {
    return this._http.post(environment.apiUrl + '/users', user, this.jwt()).map((response: Response) => response.json());
  }

  getAll() {
    return this._http.get(environment.apiUrl + '/users', this.jwt()).map((response: Response) => response.json());
  }

  getUserById(id) {
    return this._http.get(environment.apiUrl + '/users/' + id, this.jwt()).map((response: Response) => response.json());
  }

  update(user) {
    return this._http.put(environment.apiUrl + '/users/' + user._id, user, this.jwt()).map((response: Response) => response.json());
  }

  create(user) {
    return this._http.post(environment.apiUrl + '/users/new', user, this.jwt()).map((response: Response) => response.json());
  }

  destroy(user) {
    return this._http.delete(environment.apiUrl + '/users/' + user._id, this.jwt()).map((response: Response) => response.json());
  }

  updatePassword(user) {
    return this._http.put(environment.apiUrl + '/users/password/' + user._id, user, this.jwt()).map((response: Response) => response.json());
  }

  updateProfile(user) {
    return this._http.put(environment.apiUrl + '/users/profile', user, this.jwt()).map((response: Response) => response.json());
  }

  updateOwnPassword(user) {
    return this._http.put(environment.apiUrl + '/users/password', user, this.jwt()).map((response: Response) => response.json());
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
