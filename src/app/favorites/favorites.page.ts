import { Component, OnInit } from '@angular/core';
import { RecipieService } from '../recipie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favorites: any[] = []; // Array to store favorite recipes

  constructor(private recipeService: RecipieService,
    private router: Router
  ) {}

  ngOnInit() {
    // Load favorites when the component initializes
    this.loadFavorites();
  }

  ionViewWillEnter() {
    // Refresh favorites list every time the page is about to be displayed
    this.loadFavorites();
  }

  loadFavorites() {
    this.recipeService.fetchFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
        console.log(this.favorites);
      },
      error: (err) => {
        console.error('Error fetching favorites:', err);
      },
    });
  }

  removeFavorite(recipe: any) {
    // Remove recipe from favorites
    this.recipeService.removeFromFavorites(recipe).then(() => {
      // Reload favorites to reflect changes
      this.loadFavorites();
    });
  }
  openRecipe(recipeId: string) {
    this.router.navigate(['/single-recipie-info', recipeId]); // Navigate to single-recipie-info with the ID
  }

  refreshFavorites(event: any) {
    // Reload favorites during pull-to-refresh
    this.recipeService.fetchFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
        event.target.complete(); // Stop the refresher
      },
      error: (err) => {
        console.error('Error refreshing favorites:', err);
        event.target.complete(); // Ensure the refresher stops even if there's an error
      },
    });
  }
}
