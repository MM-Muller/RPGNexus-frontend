import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  user: any;
  isEditModalVisible = false;
  isDeleteModalVisible = false;
  editForm: FormGroup;
  private originalEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.originalEmail = this.user.email;
        this.editForm.patchValue({
          username: this.user.username,
          email: this.user.email,
        });
      },
      error: (err) => console.error('Failed to get user data:', err),
    });
  }

  onEdit(): void {
    this.editForm.patchValue({
      username: this.user.username,
      email: this.user.email,
      password: '',
    });
    this.isEditModalVisible = true;
  }
  
  onSave(): void {
    if (this.editForm.invalid) {
      return;
    }
    
    const formData = this.editForm.value;
    const isEmailChanged = formData.email !== this.originalEmail;
    
    const payload: any = {
      username: formData.username,
      email: formData.email,
    };
    if (formData.password) {
      payload.password = formData.password;
    }

    this.authService.updateCurrentUser(payload).subscribe({
      next: (updatedUser) => {
        this.closeEditModal();
        if (isEmailChanged) {
          this.snackBar.open('Email atualizado. Por favor, faça login novamente.', 'Fechar', {
            duration: 5000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else {
          this.user = updatedUser;
          this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      },
      error: (err) => {
        console.error('Failed to update user:', err);
        this.snackBar.open('Falha ao atualizar o perfil. Tente novamente.', 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
    });
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.snackBar.open('Deslogado com sucesso. Volte em breve!', 'Fechar', {
      duration: 3000,
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    this.router.navigate(['/auth/login']);
  }

  onDelete(): void {
    this.isDeleteModalVisible = true;
  }

  cancelDelete(): void {
    this.isDeleteModalVisible = false;
  }

  confirmDelete(): void {
    this.authService.deleteCurrentUser().subscribe({
      next: () => {
        console.log('Account deleted successfully');
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        this.snackBar.open('Conta excluída permanentemente. Lamentamos sua partida.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        console.error('Failed to delete account:', err);
        this.snackBar.open('Falha ao excluir a conta. Tente novamente.', 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
    });
  }
}