import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  async googleLogin() {
    try {
      console.log('Attempting Google Sign-In...');
      const result = await this.afAuth.signInWithPopup(
        new GoogleAuthProvider()
      );

      if (result.user) {
        console.log('User logged in successfully:', result.user);
        localStorage.setItem('user', JSON.stringify(result.user));

        // ✅ Clear navigation history and go to /tabs/home
        this.router
          .navigateByUrl('/tabs/home', { replaceUrl: true })
          .then(() => {
            console.log(
              '✅ Redirected to /tabs/home without keeping login in history'
            );
          })
          .catch((err) => {
            console.error('❌ Navigation Error:', err);
          });
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']); // ✅ Redirect to login after logout
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    return user !== null;
  }

  checkUserLoginStatus() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        console.log('User session detected, redirecting to /tabs/home...');
        localStorage.setItem('user', JSON.stringify(user));

        // ✅ Ensure that the user stays on tabs/home after login
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      }
    });
  }

  registerUser(
    fullName: string,
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return this.firestore
            .collection('users')
            .doc(user.uid)
            .set({
              fullName,
              username,
              email,
              userId: user.uid,
            })
            .then(() => {
              console.log('✅ User successfully saved to Firestore!');
            })
            .catch((error) => {
              console.error('❌ Error saving user to Firestore:', error);
              throw error; // Ensure errors are passed back
            });
        } else {
          console.error('❌ No user found after registration.');
          return Promise.reject('No user found');
        }
      })
      .catch((error) => {
        console.error('❌ Error creating user:', error);
        return Promise.reject(error); // Ensure function always returns something
      });
  }

  // Get logged-in user
  getCurrentUser() {
    return this.afAuth.authState.pipe(
      map((user) => {
        console.log('Logged-in User ID:', user?.uid);
        return user ? user.uid : null;
      })
    );
  }
  getCurrentUserObject() {
    return this.afAuth.authState;
  }
  // ✅ Ensure this function returns User | null
  getCurrentUserObjFb(): Observable<firebase.User | null> {
    return this.afAuth.authState; 
  }

  // Fetch user details from Firestore
  getUserData(uid: string): Observable<any> {
    return this.firestore
      .collection('users')
      .doc(uid)
      .valueChanges()
      .pipe(
        map((userData) => {
          console.log('Fetched User Data:', userData);
          return userData;
        })
      );
  }
}
