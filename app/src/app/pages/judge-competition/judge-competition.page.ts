import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CompetitionService } from '../../services/competition';

@Component({
  selector: 'app-judge-competition',
  templateUrl: './judge-competition.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class JudgeCompetitionPage implements OnInit {

  competitionId!: string;
  competition: any;

  constructor(
    private route: ActivatedRoute,
    private compService: CompetitionService
  ) {}

  async ngOnInit() {
    this.competitionId = this.route.snapshot.paramMap.get('id')!;
    await this.load();
  }

  async load() {
    this.competition = await this.compService.getCompetitionById(this.competitionId);
  }
}