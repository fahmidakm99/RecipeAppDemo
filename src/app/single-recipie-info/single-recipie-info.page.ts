import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipieService } from '../recipie.service';
import { ShoppingListService } from '../shopping-list-service.service';

@Component({
  selector: 'app-single-recipie-info',
  templateUrl: './single-recipie-info.page.html',
  styleUrls: ['./single-recipie-info.page.scss'],
})
export class SingleRecipieInfoPage implements OnInit {
  recipe: any;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipieService,
    public shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id') || ''; // Default to empty string if null
    if (!recipeId) {
      console.error('Recipe ID is missing.');
      return; // Optionally handle missing ID case
    }

    this.recipe = this.recipeService.getRecipeById(recipeId);

    // Initialize the `isInList` status for ingredients
    if (this.recipe?.ingredients) {
      this.updateIngredientStatuses();
    }

    // Subscribe to shopping list updates to ensure reactive UI
    this.shoppingListService.shoppingList$.subscribe(() => {
      this.updateIngredientStatuses();
    });

    this.shoppingListService.fetchFromFirebase();
  }

  // Check if an ingredient is in the shopping list
  isInShoppingList(ingredient: any): boolean {
    return this.shoppingListService.isInList(ingredient);
  }

  // Update the `isInList` status for each ingredient
  private updateIngredientStatuses() {
    this.recipe.ingredients = this.recipe.ingredients.map((ingredient: any) => ({
      ...ingredient,
      isInList: this.isInShoppingList(ingredient),
    }));
  }
  
  editRecipe(recipeId: string) {
    this.router.navigate(['/edit-recipe', recipeId]);
  }
  
  navigateToEditRecipe() {
    const recipeId = this.recipe?.id; // Ensure the recipe has an ID
    if (recipeId) {
      this.router.navigate(['/edit-recipe', recipeId]); // Navigate to edit page with recipe ID
    }
  }

}

