import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CompetitionService } from '../../services/competition';
import { Router } from '@angular/router';

@Component({
  selector: 'app-judge-home',
  templateUrl: './judge-home.page.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule // ?? ESSENCIAL
  ],
})
export class JudgeHomePage implements OnInit {

  competitions: any[] = [];
  loading = false;

  constructor(
    private compService: CompetitionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.loading = true;
    this.competitions = await this.compService.getCompetitionsForJudge();
    this.loading = false;
  }

  goToCompetition(comp: any) {
    this.router.navigate(['/judge-competition', comp.id]);
  }
}