import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  
  async googleLogin() {
    try {
      console.log("Attempting Google Sign-In...");
      const result = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
  
      if (result.user) {
        console.log("User logged in successfully:", result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
  
        // ✅ Clear navigation history and go to /tabs/home
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true }).then(() => {
          console.log("✅ Redirected to /tabs/home without keeping login in history");
        }).catch(err => {
          console.error("❌ Navigation Error:", err);
        });
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
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
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log("User session detected, redirecting to /tabs/home...");
        localStorage.setItem('user', JSON.stringify(user));

        // ✅ Ensure that the user stays on tabs/home after login
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      }
    });
  }
  
}
