import { Injectable } from '@angular/core';
import { getDatabase, ref, push, get, child } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private db = getDatabase();

  async createEntry(competitionId: string, categoryId: string, data: any) {
    const refPath = ref(this.db, `entries/${competitionId}/${categoryId}`);
    return await push(refPath, data);
  }

  async getEntries(competitionId: string, categoryId: string) {
    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, `entries/${competitionId}/${categoryId}`));

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
}