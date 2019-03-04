import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../../services/alert.service';

@Component({
  moduleId: module.id,
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnDestroy {
  private _subscription: Subscription;
  message: any;

  constructor(private _alertService: AlertService) {
    // subscribe to alert messages
    this._subscription = _alertService.getMessage().subscribe(message => { this.message = message; });
  }

  ngOnDestroy(): void {
    // unsubscribe on destroy to prevent memory leaks
    this._subscription.unsubscribe();
  }

  clear() {
    this._alertService.clearMessage();
  }

}
