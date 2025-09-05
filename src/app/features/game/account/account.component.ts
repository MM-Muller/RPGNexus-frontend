import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  user: any;
  isModalVisible = false;
  editForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
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
    this.isModalVisible = true;
  }
  
  onSave(): void {
    if (this.editForm.invalid) {
      return;
    }
    
    const formData = this.editForm.value;

    const payload: any = {
      username: formData.username,
      email: formData.email,
    };
    if (formData.password) {
      payload.password = formData.password;
    }

    this.authService.updateCurrentUser(payload).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser; 
        this.closeModal();
      },
      error: (err) => console.error('Failed to update user:', err),
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  onDelete(): void {
    if (confirm('Você tem certeza que deseja excluir sua conta permanentemente?')) {
      alert('Funcionalidade de exclusão a ser implementada!');
    }
  }
}