import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  navItems = [
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.updateActiveState(event.urlAfterRedirects);
      });

    this.updateActiveState(this.router.url);
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  onNavItemClick(clickedItem: any): void {
    this.router.navigate([clickedItem.route], {
      fragment: 'page-title',
    });
  }

  private updateActiveState(currentUrl: string): void {
    this.navItems.forEach((item) => {
      const routePath = currentUrl.split('#')[0].split('?')[0];
      item.active = item.route === routePath;
    });
  }
}
