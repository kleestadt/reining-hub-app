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

  constructor(
    private route: ActivatedRoute,
    private judgeService: JudgeService
  ) {}

  ngOnInit() {
    this.competitionId = this.route.snapshot.paramMap.get('competitionId') || '';
    this.loadJudges();
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
      await this.judgeService.createJudge(
        this.competitionId,
        { name: this.name }
      );
    }

    this.name = '';
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