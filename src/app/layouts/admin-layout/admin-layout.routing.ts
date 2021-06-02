import { AccuseReceptionComponent } from './../../accuse-reception/accuse-reception.component';
import { AuthGuard } from './../../helper/auth.guard';
import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { ListeIJ2Component } from '../../liste-ij2/liste-ij2.component';
import { Role } from '../../models/role'

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent  
    //     }]
    // }

    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin, Role.user] } },
    { path: 'demande', component: UserProfileComponent, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin, Role.user] } },
    { path: 'table-list', component: TableListComponent, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin, Role.user] } },
    { path: 'typography', component: TypographyComponent, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin, Role.user] } },
    { path: 'icons', component: IconsComponent, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin, Role.user] } },
    { path: 'maps', component: MapsComponent, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin, Role.user] } },
    { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin, Role.user] } },
    { path: 'upgrade', component: UpgradeComponent, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin, Role.user] } },
    { path: 'accusereception/:reference', component: AccuseReceptionComponent, canActivate: [AuthGuard] },
    { path: 'listeij2', component: ListeIJ2Component, canActivate: [AuthGuard], data: { roles: [Role.bo, Role.admin, Role.user] } },

];
