// import { TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { AuthGuard } from './auth.guard';  // Assuming the class is named 'AuthGuard'
// import { AuthService } from './auth.service';  // Import AuthService
// import { Router } from '@angular/router';
// import { of } from 'rxjs';

// // Mock AuthService
// class MockAuthService {
//   checkAuthStatus() {
//     return true;  // Mock authenticated status, change to `false` for testing logout
//   }
// }

// describe('AuthGuard', () => {
//   let authGuard: AuthGuard;
//   let authService: AuthService;
//   let router: Router;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule],  // Mock routing for testing
//       providers: [
//         AuthGuard,
//         { provide: AuthService, useClass: MockAuthService }  // Use mock service
//       ]
//     });

//     authGuard = TestBed.inject(AuthGuard);
//     authService = TestBed.inject(AuthService);
//     router = TestBed.inject(Router);
//   });

//   it('should be created', () => {
//     expect(authGuard).toBeTruthy();
//   });

//   it('should allow activation if user is authenticated', () => {
//     spyOn(authService, 'checkAuthStatus').and.returnValue(true);  // Mocking authenticated status
//     const canActivate = authGuard.canActivate();
//     expect(canActivate).toBe(true);  // Expect true since the user is authenticated
//   });

//   it('should block activation if user is not authenticated', () => {
//     spyOn(authService, 'checkAuthStatus').and.returnValue(false);  // Mocking not authenticated status
//     const canActivate = authGuard.canActivate();
//     expect(canActivate).toBe(false);  // Expect false since the user is not authenticated
//   });
// });
