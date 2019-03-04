import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CustomFormsModule } from 'ng2-validation';
import { MomentModule } from 'angular2-moment';

import { routing } from './app.routing';

import { AuthGuard } from './guards/index';
import { AuthService, AlertService, UserService, MealService } from './services/index';

import { AppComponent } from './app.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IsRouteActive } from './pipes/is-route-active.pipe';
import { RegisterComponent } from './components/register/register.component';
import { NewlinePipe } from './pipes/newline.pipe';
import { GroupbyPipe } from './pipes/groupby.pipe';
import { MealComponent } from './components/meal/meal.component';
import { MealFormComponent } from './components/meal/mealform.component';
import { UserComponent } from './components/user/user.component';
import { UserFormComponent } from './components/user/userform.component';
import { UserPasswordComponent } from './components/user/userpassword.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DateValidatorDirective } from './directives/date-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    DashboardComponent,
    IsRouteActive,
    RegisterComponent,
    NewlinePipe,
    GroupbyPipe,
    MealComponent,
    MealFormComponent,
    UserComponent,
    UserFormComponent,
    UserPasswordComponent,
    ProfileComponent,
    DateValidatorDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    MomentModule,
    routing
  ],
  providers: [
    AuthGuard,
    AuthService,
    AlertService,
    UserService,
    MealService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
