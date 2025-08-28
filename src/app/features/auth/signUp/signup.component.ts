import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  constructor(private router: Router) {}

  onSignup(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): void {
    if (username && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      console.log('Signup:', { username, email, password });
      // Implemente sua lógica de cadastro aqui
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
