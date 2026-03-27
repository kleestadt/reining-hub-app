import { Injectable } from '@angular/core';
import { getDatabase, ref, push, get, set, child, update, remove } from 'firebase/database';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class JudgeService {

  constructor(private authService: AuthService) {}

  private db = getDatabase();

  // criar juiz
  async createJudge(competitionId: string, name: string, email: string, password: string) {
    const currentUser = await this.authService.getCurrentUser();

    if (!currentUser) throw new Error('Usuário não autenticado');

    const ownerEmail = localStorage.getItem('email');
    const ownerPassword = localStorage.getItem('password');

    if (!ownerEmail || !ownerPassword) {
      throw new Error('Credenciais do organizador não encontradas');
    }

    // cria juiz (troca auth)
    const judgeUser = await this.authService.register(email, password, 'judge');

    // volta pro owner
    await this.authService.login(ownerEmail, ownerPassword);

    // salva juiz na competição
    const judgeRef = ref(this.db, 'judges/' + competitionId);

    await push(judgeRef, {
      name,
      userId: judgeUser.uid
    });

    // ?? NOVO: vincular juiz ? competição
    await set(
      ref(this.db, `judge_competitions/${judgeUser.uid}/${competitionId}`),
      true
    );
  }

  // listar juï¿½zes
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
