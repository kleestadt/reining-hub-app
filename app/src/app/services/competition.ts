import { Injectable } from '@angular/core';
import { getDatabase, ref, push, get, child } from 'firebase/database';
import { remove } from 'firebase/database';
import { update } from 'firebase/database';
import { AuthService } from './auth';
import { query, orderByChild, equalTo } from 'firebase/database';
import { getAuth } from 'firebase/auth';

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

    if (!user) return [];

    const competitionsRef = ref(this.db, 'competitions');
    const q = query(competitionsRef, orderByChild('ownerId'), equalTo(user.uid));
    const snapshot = await get(q);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();

    return Object.keys(data)
      .map(key => ({
        id: key,
        ...data[key]
      }));
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

  async getCompetitionsForJudge() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return [];

  const dbRef = ref(this.db);

  const judgeSnapshot = await get(child(dbRef, `judge_competitions/${user.uid}`));

  if (!judgeSnapshot.exists()) return [];

  const competitionIds = Object.keys(judgeSnapshot.val());

    const competitions: any[] = [];

    for (const id of competitionIds) {
      const compSnap = await get(child(dbRef, `competitions/${id}`));
      if (compSnap.exists()) {
        competitions.push({
          id,
          ...compSnap.val()
        });
      }
    }

    return competitions;
  }

}
