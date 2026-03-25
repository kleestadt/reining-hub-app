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

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      await this.router.navigateByUrl('/competitions');
    } catch (error) {
      console.error(error);
      alert('Erro no login');
    }
  }

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      alert('Conta criada!');
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar');
    }
  }
}