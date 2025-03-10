// src/app/all-recipes/all-recipes.page.ts
import { Component, OnInit } from '@angular/core';
import { Recipe, RecipieService } from '../service/recipie.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { FavoritesPage } from '../favorites/favorites.page';

@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.page.html',
  styleUrls: ['./all-recipes.page.scss'],
})
export class AllRecipesPages implements OnInit {
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  searchTerm: string = '';

  constructor(
    private recipeService: RecipieService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private alertController: AlertController // Inject AlertController
  ) {}

  ngOnInit() {
    this.loadRecipes();
  }
  ionViewWillEnter() {
    // Refresh data every time the page is about to enter
    this.loadRecipes();
  }

  loadRecipes() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.recipeService.getUserRecipes(user.uid).subscribe((recipes) => {
          console.log('Fetched Recipes:', recipes); // Debugging

          this.recipeService.setRecipes(recipes); // ✅ Use setter method
          this.recipes = recipes.map((recipe) => ({
            ...recipe,
            isFavorite: this.recipeService.isFavorite(recipe),
          }));
          this.filteredRecipes = [...this.recipes];
        });
      } else {
        console.error('User not authenticated');
        this.recipes = [];
        this.filteredRecipes = [];
      }
    });
  }

  // toggleFavorite(recipe: any) {
  //   recipe.isFavorite = !recipe.isFavorite; // Toggle favorite status
  //   console.log(recipe);
  //   if (recipe.isFavorite) {
  //     console.log("on",recipe.isFavorite);
  //     this.recipeService.addToFavorites(recipe);
  //   } else {
  //     console.log("off",recipe.isFavorite);
  //     this.recipeService.removeFromFavorites(recipe);
  //   }
  // }

  toggleFavorite(recipe: Recipe) {
    const updatedFavorite = recipe.favorites === 't' ? 'f' : 't'; // Toggle favorite status

    recipe.favorites = updatedFavorite; // Update locally before saving

    console.log(recipe);

    if (updatedFavorite === 't') {
      console.log('on', recipe.favorites);
      this.recipeService.addToFavorites(recipe); // Add to favorites list
    } else {
      console.log('off', recipe.favorites);
      this.recipeService.removeFromFavorites(recipe); // Remove from favorites list
    }

    // ✅ Correct way to update in AngularFirestore
    this.firestore
      .collection('recipes')
      .doc(recipe.id)
      .update({ favorites: updatedFavorite })
      .then(() => console.log(`Updated favorite status to: ${updatedFavorite}`))
      .catch((error) => console.error('Error updating favorite:', error));
  }

  goToFavorites() {
    console.log('clicked fav');
    this.router.navigate(['/favorites']); // Adjust the route based on your app's routing setup
  }
  openRecipe(recipeId: string) {
    this.router.navigate(['/single-recipie-info', recipeId]); // Navigate to single-recipie-info with the ID
  }

  // editRecipe(recipe: any) {
  //   console.log("Edit recipe", recipe);
  //   // Navigate to AddRecipePage with the recipe ID as a query parameter
  //   this.router.navigate(['/edit-recipe'], {
  //     queryParams: { id: recipe.id }, // Pass the recipe ID as query parameter
  //   });
  // }

  editRecipe(recipeId: string) {
    this.router.navigate(['/edit-recipe', recipeId]);
  }

  // deleteRecipe(recipe: any) {
  //   console.log("Delete recipe", recipe);
  //   // Handle the deletion of the recipe
  //   this.recipeService.deleteRecipe(recipe.id); // Call the delete method from the service
  // }
  // async deleteRecipe(recipe: any) {
  //   const alert = await this.alertController.create({
  //     header: 'Confirm Deletion',
  //     message: `Are you sure you want to delete the recipe "${recipe.name}"?`,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         // cssClass: 'cancel-button',
  //         handler: () => {
  //           console.log('Deletion canceled');
  //         },
  //       },
  //       {
  //         text: 'Delete',
  //         // cssClass: 'delete-button',
  //         handler: () => {
  //           this.recipeService.deleteRecipe(recipe.id);
  //           console.log('Recipe deleted:', recipe);
  //         },
  //       },
  //     ],
  //   });

  //   await alert.present();
  // }
  async deleteRecipe(recipe: any) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete the recipe "${recipe.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Deletion canceled');
          },
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              // Show loading state inside the alert
              const loading = await this.alertController.create({
                message: 'Deleting...',
                backdropDismiss: false, // Prevent dismissing
                keyboardClose: false,
              });
              await loading.present();
  
              // Remove from Firestore
              await this.firestore.collection('recipes').doc(recipe.id).delete();
              console.log('Recipe deleted from Firestore:', recipe.id);

              /// Remove from Firestore (recipeCommunity collection)
            await this.firestore.collection('recipeCommunity').doc(recipe.id).delete();
            console.log('Recipe deleted from Firestore (recipeCommunity):', recipe.id);

              // Remove locally
              this.recipes = this.recipes.filter(r => r.id !== recipe.id);
              this.filteredRecipes = [...this.recipes]; // Update filtered list
  
            console.log(recipe);
              // Notify FavoritesPage about the deletion
            this.recipeService.deleteRecipeFromAllRecipe(recipe);
            console.log('Notified favorites to remove:', recipe);

            this.recipeService.deleteRecipeFromAllRecipeCommunity(recipe);
            console.log('Notified favorites to remove:', recipe);


              console.log('Recipe removed from UI:', recipe.id);
  
              // Dismiss loading and alert
              await loading.dismiss();
              await alert.dismiss();
            } catch (error) {
              console.error('Error deleting recipe:', error);
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  
  updateRecipe(recipe: any) {
    console.log('Update recipe', recipe);
    // Handle the update of the recipe
    const updatedData = {
      title: recipe.title, // Use the updated title
      description: recipe.description, // Use the updated description
    };

    this.recipeService.updateRecipe(recipe.id, updatedData); // Call the update method from the service
  }
  filterRecipes(event: any) {
    const searchTerm = event.target.value?.toLowerCase().trim();
    if (!searchTerm) {
      // If search term is empty, show all recipes
      this.filteredRecipes = [...this.recipes];
    } else {
      // Otherwise, filter recipes based on the search term
      this.filteredRecipes = this.recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm)
      );
    }
  }
}
