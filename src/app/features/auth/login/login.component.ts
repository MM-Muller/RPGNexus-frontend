import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  loginForm: FormGroup;
  private animationFrameId: number | undefined;

  constructor(
    private router: Router,
    private el: ElementRef,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.initNeuralCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  onLogin(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.router.navigate(['/game/account']);
        },
        error: (err) => {
          this.snackBar.open('Falha no login: verifique suas credenciais.', 'Fechar', {
            duration: 5000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
      });
    } else {
      const emailControl = this.loginForm.get('email');
      const passwordControl = this.loginForm.get('password');
      
      let errorMessage = '';
      
      if (emailControl?.hasError('required') && passwordControl?.hasError('required')) {
        errorMessage = 'Por favor, preencha o e-mail e a senha para fazer login.';
      } else if (emailControl?.hasError('required')) {
        errorMessage = 'Por favor, preencha o campo de e-mail.';
      } else if (emailControl?.hasError('email')) {
        errorMessage = 'Por favor, insira um e-mail válido.';
      } else if (passwordControl?.hasError('required')) {
        errorMessage = 'Por favor, preencha o campo de senha.';
      } else {
        errorMessage = 'Por favor, verifique os campos do formulário.';
      }

      this.snackBar.open(errorMessage, 'Fechar', {
        duration: 4000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
    // Implemente a lógica de recuperação de senha aqui
  }

  navigateToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  private initNeuralCanvas(): void {
    const canvas = this.el.nativeElement.querySelector('#neuralCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance = Math.sqrt(
            Math.pow(particles[a].x - particles[b].x, 2) +
              Math.pow(particles[a].y - particles[b].y, 2)
          );
          if (distance < 100) {
            opacityValue = 1 - distance / 100;
            ctx.strokeStyle = `rgba(138, 43, 226, ${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      connectParticles();
      this.animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });
  }
}