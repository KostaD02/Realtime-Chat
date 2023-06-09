import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent, HomepageComponent, NotfoundComponent } from './views';
import { AuthedGuard, UnathedGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    canActivate: [AuthedGuard]
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [UnathedGuard]
  },
  {
    path: '404',
    component: NotfoundComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
