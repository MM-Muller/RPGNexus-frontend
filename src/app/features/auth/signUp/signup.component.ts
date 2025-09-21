import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements AfterViewInit, OnDestroy {
  private animationFrameId: number | undefined;

  constructor(
    private router: Router,
    private el: ElementRef,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.initNeuralCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  onSignup(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): void {
    if (username && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        this.snackBar.open('As senhas não coincidem!', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        return;
      }
      this.authService.signup({ username, email, password }).subscribe(
        (response) => {
          this.snackBar.open('Registro realizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          this.snackBar.open('Falha no registro: ' + error.error.detail, 'Fechar', {
            duration: 5000,
            panelClass: ['snackbar-error'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      );
    } else {
      this.snackBar.open('Todos os campos são obrigatórios!', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
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
      for (let i = 0; i < particles.length; i++) {
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