import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CompetitionService } from '../../services/competition';

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

  constructor(private compService: CompetitionService) {}

  ngOnInit() {
    this.load();
  }

  async load() {
    this.loading = true;
    this.competitions = await this.compService.getCompetitionsForJudge();
    this.loading = false;
  }
}