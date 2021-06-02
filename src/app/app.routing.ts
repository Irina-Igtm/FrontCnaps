import { LoginComponent } from './account/login/login.component';
import { ListeIJ2Component } from './liste-ij2/liste-ij2.component';
import { AccuseReceptionComponent } from './accuse-reception/accuse-reception.component';
import { AuthGuard } from './helper/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes =[
  { path: 'login', component: LoginComponent },
  { path:'liste-ij2' , component:ListeIJ2Component},
  { path:'accuse-reception' , component:AccuseReceptionComponent},
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full',
  // }, 
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
