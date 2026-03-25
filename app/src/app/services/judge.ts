import { Injectable } from '@angular/core';
import { getDatabase, ref, push, get, child, update, remove } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class JudgeService {

  private db = getDatabase();

  // criar juiz
  async createJudge(competitionId: string, data: any) {
    const refPath = ref(this.db, `judges/${competitionId}`);
    return await push(refPath, data);
  }

  // listar juízes
  async getJudges(competitionId: string) {
    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, `judges/${competitionId}`));

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

  // atualizar juiz
  async updateJudge(competitionId: string, judgeId: string, data: any) {
    const refPath = ref(this.db, `judges/${competitionId}/${judgeId}`);
    return await update(refPath, data);
  }

  // excluir juiz
  async deleteJudge(competitionId: string, judgeId: string) {
    const refPath = ref(this.db, `judges/${competitionId}/${judgeId}`);
    return await remove(refPath);
  }
}