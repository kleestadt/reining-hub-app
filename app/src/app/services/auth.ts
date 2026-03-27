import { Injectable } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';

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

    await set(ref(db, `users/${user.uid}`), {
      email: normalizedEmail,
      role
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
  }

}
