import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  user = {
    name: 'Zephyr Nova',
    email: 'zephyr.nova@explorers.com',
  };

  constructor(private router: Router) {}

  onEdit(): void {
    console.log('Editando perfil...');
  }

  onLogout(): void {
    this.router.navigate(['/home']);
  }

  onDelete(): void {
    console.log('Excluindo conta...');
  }
}