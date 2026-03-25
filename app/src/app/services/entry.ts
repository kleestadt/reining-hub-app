import { Injectable } from '@angular/core';
import { getDatabase, ref, push, get, child } from 'firebase/database';
import { remove } from 'firebase/database';
import { update } from 'firebase/database';

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

  async deleteEntry(competitionId: string, categoryId: string, entryId: string) {
    const entryRef = ref(this.db, `entries/${competitionId}/${categoryId}/${entryId}`);
    return await remove(entryRef);
  }

  async updateEntry(competitionId: string, categoryId: string, entryId: string, data: any) {
    const entryRef = ref(this.db, `entries/${competitionId}/${categoryId}/${entryId}`);
    return await update(entryRef, data);
  }

}