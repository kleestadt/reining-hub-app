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

  constructor(
    private compService: CompetitionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCompetitions();
  }

  async addCompetition() {
    if (!this.name.trim()) return;

    if (this.editingId) {
      await this.compService.updateCompetition(
        this.editingId,
        { name: this.name }
      );
      this.editingId = null;
    } else {
      await this.compService.createCompetition({ name: this.name });
    }

    this.name = '';
    this.loadCompetitions();
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
    this.competitions = await this.compService.getCompetitions();
  }

    goToCategories(id: string) {
    this.router.navigateByUrl(`/categories/${id}`);
  }
}