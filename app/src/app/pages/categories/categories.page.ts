import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category';
import { CompetitionService } from '../../services/competition';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CategoriesPage implements OnInit {

  name = '';
  categories: any[] = [];
  competitionId = '';
  competitionName = '';
  editingId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private competitionService: CompetitionService,
    private router: Router 
  ) {}

  async ngOnInit() {
    this.competitionId = this.route.snapshot.paramMap.get('id') || '';

    const comp = await this.competitionService.getCompetitionById(this.competitionId);
    this.competitionName = comp?.name || '';

    this.loadCategories();
  }

  async addCategory() {
    if (!this.name.trim()) return;

    if (this.editingId) {
      await this.categoryService.updateCategory(
        this.competitionId,
        this.editingId,
        { name: this.name }
      );
      this.editingId = null;
    } else {
      await this.categoryService.createCategory(
        this.competitionId,
        { name: this.name }
      );
    }

    this.name = '';
    this.loadCategories();
  }

  editCategory(category: any) {
    this.name = category.name;
    this.editingId = category.id;
  }

  async deleteCategory(id: string) {
    await this.categoryService.deleteCategory(this.competitionId, id);
    this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories(this.competitionId);
  }

  goToEntries(categoryId: string) {
    this.router.navigateByUrl(
      `/entries/${this.competitionId}/${categoryId}`
    );
  }
}