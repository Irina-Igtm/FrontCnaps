import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: ' . ',  icon: 'dashboard', class: '' },
    { path: '/demande', title: ' . ',  icon:'Demande', class: '' },
    // { path: '/table-list', title: ' . ',  icon:'Liste demande', class: ''},
    { path: '/listeij2', title: '.',  icon:'Liste', class: '' },
    // { path: '/typography', title: '.',  icon:'OP', class: '' },
    { path: '/icons', title: '.',  icon:'Validation', class: '' },
    // { path: '/maps', title: '.',  icon:'Tresor', class: '' },
    // { path: '/upgrade', title: '',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
