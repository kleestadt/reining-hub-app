import { Injectable } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getDatabase, ref, set, get, query, orderByChild, equalTo } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = getAuth();

  private normalizeEmail(email: string): string {
    return (email || '').trim().toLowerCase();
  }

  login(email: string, password: string) {
    const normalizedEmail = this.normalizeEmail(email);
    return signInWithEmailAndPassword(this.auth, normalizedEmail, password);
  }

  async register(email: string, password: string, role: 'owner' | 'judge' = 'owner') {
    const normalizedEmail = this.normalizeEmail(email);
    const userCredential = await createUserWithEmailAndPassword(this.auth, normalizedEmail, password);

    const user = userCredential.user;

    const db = getDatabase();

    // salva usuário
    await set(ref(db, `users/${user.uid}`), {
      email: normalizedEmail,
      role
    });

    // ?? salva índice de email
    const emailKey = normalizedEmail.replace('.', '_');

    await set(ref(db, `user_emails/${emailKey}`), {
      uid: user.uid
    });

    return user;
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        resolve(user);
      });
    });
  }

  async getUserData(uid: string) {
    const db = getDatabase();
    const snapshot = await get(ref(db, `users/${uid}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  }

  async createUserData(uid: string, email: string, role: 'owner' | 'judge' = 'owner') {
    const db = getDatabase();

    const normalizedEmail = this.normalizeEmail(email);

    await set(ref(db, `users/${uid}`), {
      email: normalizedEmail,
      role
    });

    // ?? índice
    const emailKey = normalizedEmail.replace('.', '_');

    await set(ref(db, `user_emails/${emailKey}`), {
      uid
    });
  }

  async findUserByEmail(email: string) {
    const db = getDatabase();

    const normalizedEmail = this.normalizeEmail(email);
    const emailKey = normalizedEmail.replace('.', '_');

    const snapshot = await get(ref(db, `user_emails/${emailKey}`));

    if (snapshot.exists()) return snapshot.val(); // { uid }

    // fallback: search users by email if the index is missing
    const usersQuery = query(
      ref(db, 'users'),
      orderByChild('email'),
      equalTo(normalizedEmail)
    );

    const usersSnapshot = await get(usersQuery);

    if (!usersSnapshot.exists()) return null;

    const usersData = usersSnapshot.val();
    const uid = Object.keys(usersData)[0];

    // try to rebuild index for future lookups
    try {
      await set(ref(db, `user_emails/${emailKey}`), { uid });
    } catch {
      // ignore index write failures (permissions, etc.)
    }

    return { uid };
  }

}
