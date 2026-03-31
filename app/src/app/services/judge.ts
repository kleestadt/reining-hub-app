import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set, child, update, remove } from 'firebase/database';
import { AuthService } from './auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

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

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await this.authService.findUserByEmail(normalizedEmail);

    let userId: string;

    if (existingUser?.uid) {
      userId = existingUser.uid;
    } else {
      const ownerEmail = localStorage.getItem('email');
      const ownerPassword = localStorage.getItem('password');

      if (!ownerEmail || !ownerPassword) {
        throw new Error('Credenciais do organizador não encontradas');
      }

      // cria juiz (troca auth)
      const judgeUser = await this.authService.register(normalizedEmail, password, 'judge');

      userId = judgeUser.uid;

      // volta pro owner
      await this.authService.login(ownerEmail, ownerPassword);
    }

    // salva juiz na competição (idempotente por userId)
    await set(ref(this.db, `judges/${competitionId}/${userId}`), {
      name,
      userId
    });

    // vincular juiz à competição
    await set(ref(this.db, `judge_competitions/${userId}/${competitionId}`), true);
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

  async addJudgeToCompetition(competitionId: string, name: string, email: string) {

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.authService.findUserByEmail(normalizedEmail);

    let userId: string;

    if (existingUser) {
      // ✅ já existe → NÃO cria de novo
      userId = existingUser.uid;

    } else {
      // 🆕 cria novo usuário
      const password = '123456';

      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);

      userId = userCredential.user.uid;

      // salva user
      await set(ref(this.db, `users/${userId}`), {
        email: normalizedEmail,
        role: 'judge'
      });

      // salva índice (SÓ aqui!)
      const emailKey = normalizedEmail.replace('.', '_');

      await set(ref(this.db, `user_emails/${emailKey}`), {
        uid: userId
      });
    }

    // 🔗 vincular SEMPRE (mesmo se já existir)
    await set(ref(this.db, `judges/${competitionId}/${userId}`), {
      userId,
      name
    });

    await set(ref(this.db, `judge_competitions/${userId}/${competitionId}`), true);
  }
}
