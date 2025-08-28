import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private router: Router) {}

  onLogin(email: string, password: string): void {
    if (email && password) {
      console.log('Login:', { email, password });
      // Implemente sua lógica de autenticação aqui
    }
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
    // Implemente sua lógica de recuperação de senha aqui
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
