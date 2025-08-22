import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  navItems = [
    {
      id: 'home',
      icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
      active: true,
    },
    {
      id: 'menu',
      icon: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z',
      active: false,
    },
    {
      id: 'favorites',
      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      active: false,
    },
    {
      id: 'settings',
      icon: 'M12 1v6m0 10v6m11-7h-6m-10 0H1',
      active: false,
    },
  ];

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  onNavItemClick(clickedItem: any): void {
    // Remove active from all items
    this.navItems.forEach((item) => (item.active = false));

    // Set clicked item as active
    clickedItem.active = true;

    // Emit event or handle navigation logic
    console.log(`Navigating to: ${clickedItem.id}`);
  }
}
