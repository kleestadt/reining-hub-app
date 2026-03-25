import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { EntryService } from '../../services/entry';

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

  competitionId = '';
  categoryId = '';

  constructor(
    private route: ActivatedRoute,
    private entryService: EntryService
  ) {}

  ngOnInit() {
    this.competitionId = this.route.snapshot.paramMap.get('competitionId') || '';
    this.categoryId = this.route.snapshot.paramMap.get('categoryId') || '';

    this.loadEntries();
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
    this.entries = await this.entryService.getEntries(
      this.competitionId,
      this.categoryId
    );
  }

  generateOrder() {
    this.entries = this.entries
      .map(e => ({ ...e, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((e, index) => ({
        ...e,
        order: index + 1
      }));
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

}