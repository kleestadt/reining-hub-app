import { Injectable } from '@angular/core';
import { getDatabase, ref, push, get, child } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  private db = getDatabase();

  async createCompetition(data: any) {
    const competitionsRef = ref(this.db, 'competitions');
    return await push(competitionsRef, data);
  }

  async getCompetitions() {
    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, 'competitions'));

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

  async getCompetitionById(id: string) {
    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, `competitions/${id}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  }
}