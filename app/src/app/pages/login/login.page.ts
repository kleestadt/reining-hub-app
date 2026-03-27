import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginPage {

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  private normalizeEmail(email: string): string {
    return (email || '').trim().toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private getAuthErrorMessage(error: any): string {
    if (error?.message === 'Usuário sem dados cadastrados') {
      return error.message;
    }

    const code = error?.code || '';

    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email ou senha inválidos.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-disabled':
        return 'Usuário desativado.';
      case 'auth/email-already-in-use':
        return 'Este email já está em uso.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      default:
        return 'Erro de autenticação.';
    }
  }

  async login() {
    const email = this.normalizeEmail(this.email);
    const password = this.password;

    if (!email || !password) {
      alert('Informe email e senha.');
      return;
    }

    if (!this.isValidEmail(email)) {
      alert('Email inválido.');
      return;
    }

    try {
      const userCredential = await this.authService.login(email, password);

      const user = userCredential.user;

      // salvar credenciais (MVP)
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);

      let userData = await this.authService.getUserData(user.uid);

      if (!userData) {
        // cria automaticamente o registro no database
        await this.authService.createUserData(user.uid, email, 'owner');
        userData = await this.authService.getUserData(user.uid);
      }

      if (!userData) {
        throw new Error('Usuário sem dados cadastrados');
      }

      if (userData.role === 'owner') {
        await this.router.navigateByUrl('/competitions');
      } else if (userData.role === 'judge') {
        await this.router.navigateByUrl('/judge-home');
      } else {
        alert('Perfil de usuário inválido.');
      }

    } catch (error) {
      console.error(error);
      alert(this.getAuthErrorMessage(error));
    }
  }

  async register() {
    const email = this.normalizeEmail(this.email);
    const password = this.password;

    if (!email || !password) {
      alert('Informe email e senha.');
      return;
    }

    if (!this.isValidEmail(email)) {
      alert('Email inválido.');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await this.authService.register(email, password);
      alert('Conta criada!');
    } catch (error) {
      console.error(error);
      alert(this.getAuthErrorMessage(error));
    }
  }
}
