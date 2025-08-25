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
      name: 'Universo',
      // Alterado de 'icon' para 'iconUrl' com o caminho do arquivo
      iconUrl: 'assets/icons/universo.svg',
      active: true,
    },
    {
      id: 'historia',
      name: 'História',
      iconUrl: 'assets/icons/historia.svg',
      active: false,
    },
    {
      id: 'personagens',
      name: 'Personagens',
      iconUrl: 'assets/icons/personagens.svg',
      active: false,
    },
    {
      id: 'objetivo',
      name: 'Objetivo',
      iconUrl: 'assets/icons/objetivo.svg',
      active: false,
    },
  ];

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  onNavItemClick(clickedItem: any): void {
    this.navItems.forEach((item) => (item.active = false));
    clickedItem.active = true;
    console.log(`Navigando para: ${clickedItem.name} (${clickedItem.id})`);
  }
}
