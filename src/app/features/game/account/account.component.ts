import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        console.log('User data:', this.user);
      },
      error: (err) => {
        console.error('Failed to get user data:', err);
        // Opcional: redirecionar para o login se o token for inválido
        // this.router.navigate(['/auth/login']);
      },
    });
  }

  onEdit(): void {
    // Lógica para edição de perfil (a ser implementada)
    console.log('Botão Editar Perfil clicado');
    alert('Funcionalidade de edição a ser implementada!');
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  onDelete(): void {
    // Lógica para exclusão de conta (a ser implementada)
    console.log('Botão Excluir Conta clicado');
    if (confirm('Você tem certeza que deseja excluir sua conta permanentemente?')) {
      alert('Funcionalidade de exclusão a ser implementada!');
    }
  }
}