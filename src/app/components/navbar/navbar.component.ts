import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  navItems = [
    {
      id: 'home',
      name: 'Universo',
      iconUrl: 'assets/icons/universo.svg',
      route: '/home',
      active: true,
    },
    {
      id: 'historia',
      name: 'História',
      iconUrl: 'assets/icons/historia.svg',
      route: '/historia',
      active: false,
    },
    {
      id: 'personagens',
      name: 'Personagens',
      iconUrl: 'assets/icons/personagens.svg',
      route: '/personagens',
      active: false,
    },
    {
      id: 'objetivo',
      name: 'Objetivo',
      iconUrl: 'assets/icons/objetivo.svg',
      route: '/objetivo',
      active: false,
    },
  ];

  constructor(private router: Router) {}

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  onNavItemClick(clickedItem: any): void {
    this.navItems.forEach((item) => (item.active = false));
    clickedItem.active = true;
    this.router.navigate([clickedItem.route]);
  }
}
