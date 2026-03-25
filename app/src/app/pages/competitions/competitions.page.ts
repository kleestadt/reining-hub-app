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

  constructor(
    private compService: CompetitionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCompetitions();
  }

  async addCompetition() {
    if (!this.name) return;

    await this.compService.createCompetition({ name: this.name });

    this.name = '';
    this.loadCompetitions();
  }

  async loadCompetitions() {
    this.competitions = await this.compService.getCompetitions();
  }

    goToCategories(id: string) {
    this.router.navigateByUrl(`/categories/${id}`);
  }
}