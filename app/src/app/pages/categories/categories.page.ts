import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton, IonList } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category';
import { CompetitionService } from '../../services/competition';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    CommonModule,
    FormsModule
  ]
})
export class CategoriesPage implements OnInit {

  name = '';
  categories: any[] = [];
  competitionId = '';
  competitionName = '';

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private competitionService: CompetitionService
  ) {}

  async ngOnInit() {
    this.competitionId = this.route.snapshot.paramMap.get('id') || '';

    const comp = await this.competitionService.getCompetitionById(this.competitionId);
    this.competitionName = comp?.name || '';

    this.loadCategories();
  }

  async addCategory() {
    if (!this.name) return;

    await this.categoryService.createCategory(this.competitionId, {
      name: this.name
    });

    this.name = '';
    this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories(this.competitionId);
  }
}