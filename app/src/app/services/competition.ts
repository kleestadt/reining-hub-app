import { Injectable } from '@angular/core';
import { getDatabase, ref, push, get, child } from 'firebase/database';
import { remove } from 'firebase/database';
import { update } from 'firebase/database';
import { AuthService } from './auth';
import { query, orderByChild, equalTo } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  
  private db = getDatabase();

  constructor(private authService: AuthService) {}

  async createCompetition(data: any) {
    const user = await this.authService.getCurrentUser();

    if (!user) throw new Error('Usuário não autenticado');

    const competitionsRef = ref(this.db, 'competitions');

    return await push(competitionsRef, {
      ...data,
      ownerId: user.uid
    });
  }

  async getCompetitions() {
    const user = await this.authService.getCurrentUser();

    console.log('USER:', user);

    if (!user) throw new Error('Usuário não autenticado');

    const competitionsRef = ref(this.db, 'competitions');

    const competitionsQuery = query(
      competitionsRef,
      orderByChild('ownerId'),
      equalTo(user.uid)
    );

    const snapshot = await get(competitionsQuery);

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
    const user = await this.authService.getCurrentUser();

    if (!user) throw new Error('Usuário não autenticado');

    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, `competitions/${id}`));

    if (snapshot.exists()) {
      const data = snapshot.val();

      if (data.ownerId !== user.uid) {
        throw new Error('Acesso negado');
      }

      return data;
    } else {
      return null;
    }
  }

  async deleteCompetition(competitionId: string) {
    const competitionRef = ref(this.db, `competitions/${competitionId}`);
    return await remove(competitionRef);
  }

  async updateCompetition(competitionId: string, data: any) {
    const competitionRef = ref(this.db, `competitions/${competitionId}`);
    return await update(competitionRef, data);
  }
}