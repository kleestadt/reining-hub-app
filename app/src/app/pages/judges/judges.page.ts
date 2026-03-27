import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { JudgeService } from '../../services/judge';

@Component({
  selector: 'app-judges',
  templateUrl: './judges.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class JudgesPage implements OnInit {

  name = '';
  judges: any[] = [];

  competitionId = '';
  editingId: string | null = null;

  email = '';
  password = '';

  constructor(
    private route: ActivatedRoute,
    private judgeService: JudgeService
  ) {}

  ngOnInit() {
    this.competitionId = this.route.snapshot.paramMap.get('competitionId') || '';
    this.loadJudges();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async addJudge() {
    if (!this.name.trim()) return;

    if (this.editingId) {
      await this.judgeService.updateJudge(
        this.competitionId,
        this.editingId,
        { name: this.name }
      );
      this.editingId = null;

    } else {
      const email = this.email.trim().toLowerCase();
      const password = this.password;

      if (!email || !password) {
        alert('Informe email e senha do juiz.');
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

      await this.judgeService.createJudge(
        this.competitionId,
        this.name,
        email,
        password
      );
    }

    this.name = '';
    this.email = '';
    this.password = '';
    this.loadJudges();
  }

  editJudge(judge: any) {
    this.name = judge.name;
    this.editingId = judge.id;
  }

  async deleteJudge(id: string) {
    await this.judgeService.deleteJudge(this.competitionId, id);
    this.loadJudges();
  }

  async loadJudges() {
    this.judges = await this.judgeService.getJudges(this.competitionId);
  }
}
