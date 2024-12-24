// src/app/all-recipes/all-recipes.page.ts
import { Component, OnInit } from '@angular/core';
import { RecipieService } from '../recipie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.page.html',
  styleUrls: ['./all-recipes.page.scss'],
})
export class AllRecipesPages implements OnInit {
  recipes: any[] = [];
  constructor(
    private recipeService: RecipieService,
    private router: Router
  ){}

  ngOnInit() {
    // Subscribe to recipes observable to fetch the list
    // this.recipeService.recipes$.subscribe((recipes) => {
    //   this.recipes = recipes.map((recipe) => ({
    //     ...recipe,
    //     isFavorite: this.recipeService.isFavorite(recipe), // Check favorite status
    //   }));
    // });
    this.loadRecipes();
    // this.recipeService.getRecipes().then(recipes => {
    //   console.log('Loaded recipes:', recipes);
    // });
  }
  ionViewWillEnter() {
    // Refresh data every time the page is about to enter
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.recipes$.subscribe((recipes) => {
      this.recipes = recipes.map((recipe) => ({
        ...recipe,
        isFavorite: this.recipeService.isFavorite(recipe),
      }));
    });
    // this.recipeService.getRecipes().then(recipes => {
    //   console.log('Loaded recipes:', recipes);
    // });
  }


  toggleFavorite(recipe: any) {
    recipe.isFavorite = !recipe.isFavorite; // Toggle favorite status
    console.log(recipe);
    if (recipe.isFavorite) {
      
      this.recipeService.addToFavorites(recipe);
    } else {
      this.recipeService.removeFromFavorites(recipe);
    }
  }
  goToFavorites() {
    console.log("clicked fav");
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
  
  
  deleteRecipe(recipe: any) {
    console.log("Delete recipe", recipe);
    // Handle the deletion of the recipe
    this.recipeService.deleteRecipe(recipe.id); // Call the delete method from the service
  }
  
  updateRecipe(recipe: any) {
    console.log("Update recipe", recipe);
    // Handle the update of the recipe
    const updatedData = {
      title: recipe.title, // Use the updated title
      description: recipe.description, // Use the updated description
    };
  
    this.recipeService.updateRecipe(recipe.id, updatedData); // Call the update method from the service
  }
  
}
