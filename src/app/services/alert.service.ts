import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertService {
  private _subject = new Subject<any>();
  private _keepAfterNavigationChange = false;

  constructor(private _router: Router) {
    _router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this._keepAfterNavigationChange) {
          // only keep for a single location change
          this._keepAfterNavigationChange = false;
        } else {
          // clear alert
          this._subject.next();
        }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false) {
    this._keepAfterNavigationChange = keepAfterNavigationChange;
    this._subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this._keepAfterNavigationChange = keepAfterNavigationChange;
    this._subject.next({ type: 'error', text: message });
  }

  getMessage(): Observable<any> {
    return this._subject.asObservable();
  }

  clearMessage() {
    this._subject.next();
  }

}
