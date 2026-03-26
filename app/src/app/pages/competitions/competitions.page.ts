import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompetitionService } from '../../services/competition';
import { Router } from '@angular/router';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CompetitionsPage implements OnInit {

  name = '';
  competitions: any[] = [];
  editingId: string | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private compService: CompetitionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCompetitions();
  }

  async addCompetition() {
    if (!this.name.trim()) return;

    const payload = {
      name: this.name
    };

    if (this.editingId) {
      await this.compService.updateCompetition(
        this.editingId,
        payload
      );
      this.cancelEdit(); // ?? já aproveitamos melhoria do item 5
    } else {
      await this.compService.createCompetition(payload);
    }

    this.name = '';
    this.loadCompetitions();
  }

  cancelEdit() {
    this.editingId = null;
    this.name = '';
  }

  goToJudges(id: string) {
    this.router.navigateByUrl(`/judges/${id}`);
  }

  editCompetition(competition: any) {
    this.name = competition.name;
    this.editingId = competition.id;
  }

  async deleteCompetition(id: string) {
    await this.compService.deleteCompetition(id);
    this.loadCompetitions();
  }

  async loadCompetitions() {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.competitions = await this.compService.getCompetitions();
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  }

  goToCategories(id: string) {
    this.router.navigateByUrl(`/categories/${id}`);
  }
}