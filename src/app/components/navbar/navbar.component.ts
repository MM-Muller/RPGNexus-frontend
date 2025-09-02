import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  mainNavItems = [
    {
      id: 'home',
      name: 'Universo',
      iconUrl: 'assets/icons/universo.svg',
      route: '/home',
      active: false,
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

  gameNavItems = [
    {
      id: 'account',
      name: 'Conta',
      iconUrl: 'assets/icons/config.svg',
      route: '/game/account',
      active: false,
    },
    {
      id: 'characters',
      name: 'Personagens',
      iconUrl: 'assets/icons/user.svg',
      route: '/game/characters',
      active: false,
    },
  ];

  navItems = this.mainNavItems;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isLoggedIn = event.urlAfterRedirects.startsWith('/game');
        this.navItems = this.isLoggedIn ? this.gameNavItems : this.mainNavItems;
        this.updateActiveState(event.urlAfterRedirects);
      });

    this.isLoggedIn = this.router.url.startsWith('/game');
    this.navItems = this.isLoggedIn ? this.gameNavItems : this.mainNavItems;
    this.updateActiveState(this.router.url);
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  onNavItemClick(clickedItem: any): void {
    this.router.navigate([clickedItem.route]);
  }

  private updateActiveState(currentUrl: string): void {
    this.navItems.forEach((item) => {
      const routePath = currentUrl.split('#')[0].split('?')[0];
      item.active = item.route === routePath;
    });
  }
}
