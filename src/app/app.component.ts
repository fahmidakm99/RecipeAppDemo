import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menuController: MenuController, private router: Router) {}

  // Method to close the menu and navigate
  closeMenuAndNavigate(route: string) {
    this.menuController.close(); // Close the menu
    this.router.navigateByUrl(route); // Navigate to the specified route
  }

  // closeMenuAndNavigate(route: string): void {
  //   this.menuController.close().then(() => {
  //     this.router.navigate([route]).then(() => {
  //       console.log(`Navigated to ${route}`);
  //     }).catch((error) => {
  //       console.error(`Navigation error: ${error}`);
  //     });
  //   }).catch((error) => {
  //     console.error(`Menu close error: ${error}`);
  //   });
  // }

}
