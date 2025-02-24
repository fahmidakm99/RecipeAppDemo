// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { MenuController } from '@ionic/angular';
// import { AuthService } from './auth.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],
// })
// export class AppComponent {
//   constructor(private menuController: MenuController, private router: Router, private authService: AuthService) {}

//   // Method to close the menu and navigate
//   closeMenuAndNavigate(route: string) {
//     this.menuController.close(); // Close the menu
//     this.router.navigateByUrl(route); // Navigate to the specified route
//   }
//   ngOnInit() {
//     // Check authentication status on app load
//     this.authService.initializeAuthStatus();
//   }
// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular'; // ✅ Import MenuController
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform,
    private menuController: MenuController // ✅ Inject MenuController
  ) {
    this.initializeBackButton();
  }

  ngOnInit() {
    console.log("Checking user login status...");
    this.authService.checkUserLoginStatus();
  }

  // ✅ Ensure the menu closes before navigating
  closeMenuAndNavigate(route: string) {
    this.menuController.close().then(() => { // ✅ Ensure menu closes before navigation
      this.router.navigateByUrl(route);
    });
  }

  // ✅ Prevent back button from going to login after login
  initializeBackButton() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/tabs/home') {
        console.log("🔹 Back button disabled on home page");
      } else {
        window.history.back(); // Allow normal back behavior
      }
    });
  }
  logout(route: string) {
    this.authService.logout();
    this.menuController.close().then(() => { // ✅ Ensure menu closes before navigation
      this.router.navigateByUrl(route);
    });
  }
}
