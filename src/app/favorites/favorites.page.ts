// import { Component, OnInit } from '@angular/core';
// import { RecipieService } from '../service/recipie.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-favorites',
//   templateUrl: './favorites.page.html',
//   styleUrls: ['./favorites.page.scss'],
// })
// export class FavoritesPage implements OnInit {
//   favorites: any[] = []; // Array to store favorite recipes

//   constructor(
//     private recipeService: RecipieService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     // Load favorites when the component initializes
//     this.loadFavorites();
//   }

//   ionViewWillEnter() {
//     // Refresh favorites list every time the page is about to be displayed
//     this.loadFavorites();
//   }

//   loadFavorites() {
//     this.recipeService.fetchFavorites().subscribe({
//       next: (data) => {
//         this.favorites = data;
//         console.log(this.favorites);
//       },
//       error: (err) => {
//         console.error('Error fetching favorites:', err);
//       },
//     });
//   }

//   removeFavorite(recipe: any) {
//     // Remove recipe from favorites
//     this.recipeService.removeFromFavorites(recipe).then(() => {
//       // Reload favorites to reflect changes
//       this.loadFavorites();
//     });
//   }
//   openRecipe(recipeId: string) {
//     this.router.navigate(['/single-recipie-info', recipeId]); // Navigate to single-recipie-info with the ID
//   }

//   refreshFavorites(event: any) {
//     // Reload favorites during pull-to-refresh
//     this.recipeService.fetchFavorites().subscribe({
//       next: (data) => {
//         this.favorites = data;
//         event.target.complete(); // Stop the refresher
//       },
//       error: (err) => {
//         console.error('Error refreshing favorites:', err);
//         event.target.complete(); // Ensure the refresher stops even if there's an error
//       },
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { RecipieService } from '../service/recipie.service';
import { AuthService } from '../service/auth.service'; // Import AuthService
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favorites: any[] = [];
  userId: string = '';
  allRecipes: any[] = []; // Ensure allRecipes is defined
  favoriteRecipes: any[] = [];

  constructor(
    private recipeService: RecipieService,
    private authService: AuthService, // Inject AuthService
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((userId) => {
      if (userId) {
        this.userId = userId;

        // First, fetch all recipes
        this.recipeService.getUserRecipes(userId).subscribe((allRecipes) => {
          this.allRecipes = allRecipes;
          console.log('All Recipes Loaded:', this.allRecipes);
          

          // Now that allRecipes is ready, fetch favorites
          this.loadFavorites();

          
        
        });
      }
    });
  }

  goBack() {
    const previousPage = sessionStorage.getItem('previousPage');
    if (previousPage) {
      sessionStorage.removeItem('previousPage'); // Clear after use
      this.router.navigateByUrl(previousPage);
    } else {
      this.location.back();
    }
  }
  

  ionViewWillEnter() {
    if (this.userId) {
      this.loadFavorites();
    }
  }

  loadFavorites() {
    if (!this.userId) return; // Prevent unnecessary API calls

    this.recipeService.fetchFavorites(this.userId).subscribe({
      next: (favorites) => {
        console.log('Fetched Favorites:', favorites); // Log fetched favorites
        this.favorites = favorites; // ✅ Ensure favorites list is updated

        if (!this.allRecipes || this.allRecipes.length === 0) {
          console.warn('allRecipes is empty or not initialized!');
          return;
        }

        this.allRecipes = this.allRecipes.map((recipe) => ({
          ...recipe,
          favorites: this.favorites.some((fav) => fav.id === recipe.id)
            ? 't'
            : 'f', // ✅ Properly update status
        }));

        console.log('Updated recipes with favorite status:', this.allRecipes);
      },
      error: (err) => console.error('Error fetching favorites:', err),
    });
  }

  // removeFavorite(recipe: any) {
  //   console.log('Removing favorite:', recipe);
  //   console.log('Recipe ID:', recipe.id); // Check if this is defined

  //   if (!recipe.id) {
  //     console.error('Invalid Recipe ID! Cannot remove.');
  //     return;
  //   }

  //   this.recipeService
  //     .removeFromFavorites(recipe)
  //     .then(() => {
  //       this.loadFavorites();
  //     })
  //     .catch((error) => console.error('Error removing favorite:', error));
  // }
  removeFavorite(recipe: any) {
    console.log('Removing favorite:', recipe);
    console.log('Recipe ID:', recipe.id); // Check if this is defined

    if (!recipe.id) {
      console.error('Invalid Recipe ID! Cannot remove.');
      return;
    }

    this.recipeService
      .removeFromFavorites(recipe)
      .then(() => {
        this.loadFavorites();
      })

      .catch((error) => console.error('Error removing favorite:', error));
  }
  openRecipe(recipe: any) {
    if (!recipe.id) {
      console.error("Recipe ID is missing!");
      return;
    }
  
    sessionStorage.setItem('previousPage', this.router.url); // Store current page before navigation
    this.router.navigate(['/single-recipie-info', recipe.id]); // Navigate using recipe ID
  }
  

  refreshFavorites(event: any) {
    if (!this.userId) return;

    this.recipeService.fetchFavorites(this.userId).subscribe({
      next: (data) => {
        this.favorites = data;
        event.target.complete();
      },
      error: (err) => {
        console.error('Error refreshing favorites:', err);
        event.target.complete();
      },
    });
  }
}
