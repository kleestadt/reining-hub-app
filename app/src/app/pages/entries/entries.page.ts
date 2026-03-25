import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { EntryService } from '../../services/entry';
import { JudgeService } from '../../services/judge';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EntriesPage implements OnInit {

  name = '';
  horse = '';
  entries: any[] = [];
  editingId: string | null = null;
  judges: any[] = [];

  competitionId = '';
  categoryId = '';

  constructor(
    private route: ActivatedRoute,
    private entryService: EntryService,
    private judgeService: JudgeService
  ) {}

  ngOnInit() {
    this.competitionId = this.route.snapshot.paramMap.get('competitionId') || '';
    this.categoryId = this.route.snapshot.paramMap.get('categoryId') || '';

    this.loadEntries();
    this.loadJudges();
  }

  hasOrder(): boolean {
    return this.entries.some(e => e.order);
  }

  hasUnorderedEntries(): boolean {
    return this.entries.some(e => !e.order);
  }

  async addEntry() {
    if (!this.name.trim() || !this.horse.trim()) return;

    if (this.editingId) {
      await this.entryService.updateEntry(
        this.competitionId,
        this.categoryId,
        this.editingId,
        {
          name: this.name,
          horse: this.horse
        }
      );

      this.editingId = null;

    } else {
      await this.entryService.createEntry(
        this.competitionId,
        this.categoryId,
        {
          name: this.name,
          horse: this.horse
        }
      );
    }

    this.name = '';
    this.horse = '';
    this.loadEntries();
  }

  async loadEntries() {
    const data = await this.entryService.getEntries(
      this.competitionId,
      this.categoryId
    );

    this.entries = data.map(e => ({
      ...e,
      scores: e.scores || {}
    }))
    .sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  async generateOrder() {

    const unordered = this.entries.filter(e => !e.order);

    if (unordered.length === 0) {
      alert('Todos já possuem ordem!');
      return;
    }

    const shuffled = unordered
      .map(e => ({ ...e, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort);

    // pegar maior ordem atual
    const maxOrder = Math.max(
      ...this.entries.map(e => e.order || 0)
    );

    for (let i = 0; i < shuffled.length; i++) {
      const entry = shuffled[i];

      await this.entryService.updateEntry(
        this.competitionId,
        this.categoryId,
        entry.id,
        { order: maxOrder + i + 1 }
      );
    }

    this.loadEntries();
  }

  async deleteEntry(id: string) {
    await this.entryService.deleteEntry(
      this.competitionId,
      this.categoryId,
      id
    );

    this.loadEntries();
  }

  editEntry(entry: any) {
    this.name = entry.name;
    this.horse = entry.horse;
    this.editingId = entry.id;
  }

  async loadJudges() {
    this.judges = await this.judgeService.getJudges(this.competitionId);
  }

  async saveScore(entry: any) {
    await this.entryService.updateEntry(
      this.competitionId,
      this.categoryId,
      entry.id,
      { scores: entry.scores }
    );
  }

  getAverage(entry: any): number {

    const scores = Object.values(entry.scores || {})
      .map((s: any) => Number(s));

    if (!scores.length) return 0;

    const total = scores.reduce((a, b) => a + b, 0);

    return total / scores.length;
  }

  getRanking() {
    return [...this.entries]
      .sort((a, b) => this.getAverage(b) - this.getAverage(a));
  }

}