import { OpAperiodiqueComponent } from './op-aperiodique/op-aperiodique.component';
import { TraitementService } from './services/traitement/traitement.service';
import { LoginComponent } from './account/login/login.component';
import { AccountService } from './services/account/account.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';


import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ErrorInterceptor } from './helper/error.interceptor';
import { JwtInterceptor } from './helper/jwt.interceptor';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxCollapseModule } from 'ngx-collapse';
import { ToastrModule } from 'ngx-toastr';
import { NgxSelectModule } from 'ngx-select-ex';
import { ListeIJ2Component } from './liste-ij2/liste-ij2.component';
import { AccuseReceptionComponent } from './accuse-reception/accuse-reception.component';
import { OpIj2Component } from './op-ij2/op-ij2.component';
import { DetailsIj2Component } from './details-ij2/details-ij2.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
enableProdMode();

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),
    CommonModule,
    BrowserModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgxCollapseModule,
    ToastrModule.forRoot(),
    NgxSelectModule,
    NgbModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    ListeIJ2Component,
    AccuseReceptionComponent,
    OpIj2Component,
    DetailsIj2Component,
    UploadFilesComponent,
    OpAperiodiqueComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AccountService,
    TraitementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
