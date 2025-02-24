// // auth.guard.ts
// import { Injectable } from '@angular/core';
// import { CanActivate } from '@angular/router';
// import { Router } from '@angular/router';
// import { AuthService } from './auth.service'; // Assuming you have an AuthService that tracks the login state

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.authService.checkAuthStatus()) { // Check auth status on each route request
//       return true;
//     } else {
//       this.router.navigate(['/login']); // Redirect to login page if not authenticated
//       return false;
//     }
//   }
// }
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const authenticated = await this.authService.isAuthenticated();
    console.log("AuthGuard Check:", authenticated);
    
    if (!authenticated) {
      console.log("🔴 Not authenticated, preventing access...");
      this.router.navigate(['/login']);
      return false;
    }

    console.log("🟢 Authenticated, allowing access...");
    return true;
  }
}


