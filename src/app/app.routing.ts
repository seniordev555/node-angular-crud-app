import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { MealFormComponent } from './components/meal/mealform.component';
import { UserComponent } from './components/user/user.component';
import { UserFormComponent } from './components/user/userform.component';
import { UserPasswordComponent } from './components/user/userpassword.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MealComponent } from './components/meal/meal.component';
import { AuthGuard } from './guards/index';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'meals', component: MealComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'meals/new', pathMatch: 'full', component: MealFormComponent, canActivate: [AuthGuard] },
  { path: 'meals/:id', component: MealFormComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserComponent, canActivate: [AuthGuard], data: { roles: ['manager', 'admin'] } },
  { path: 'users/new', pathMatch: 'full', component: UserFormComponent, canActivate: [AuthGuard], data: { roles: ['manager', 'admin'] } },
  { path: 'users/:id', component: UserFormComponent, canActivate: [AuthGuard], data: { roles: ['manager', 'admin'] } },
  { path: 'users/password/:id', component: UserPasswordComponent, canActivate: [AuthGuard], data: { roles: ['manager', 'admin'] } },
  { path: 'profile', pathMatch: 'full', component: ProfileComponent, canActivate: [AuthGuard] },

  // otherwise redirect to dashboard
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
