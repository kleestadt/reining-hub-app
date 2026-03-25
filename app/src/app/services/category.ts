import { Injectable } from '@angular/core';
import { getDatabase, ref, push, get, child } from 'firebase/database';
import { remove } from 'firebase/database';
import { update } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private db = getDatabase();

  async createCategory(competitionId: string, data: any) {
    const refPath = ref(this.db, `categories/${competitionId}`);
    return await push(refPath, data);
  }

  async getCategories(competitionId: string) {
    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, `categories/${competitionId}`));

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    } else {
      return [];
    }
  }

  async deleteCategory(competitionId: string, categoryId: string) {
    const categoryRef = ref(this.db, `categories/${competitionId}/${categoryId}`);
    return await remove(categoryRef);
  }

  async updateCategory(competitionId: string, categoryId: string, data: any) {
    const categoryRef = ref(this.db, `categories/${competitionId}/${categoryId}`);
    return await update(categoryRef, data);
  }

}