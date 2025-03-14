import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipieService } from '../service/recipie.service';
import { ShoppingListService } from '../service/shopping-list-service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Location } from '@angular/common';

@Component({
  selector: 'app-single-recipie-info',
  templateUrl: './single-recipie-info.page.html',
  styleUrls: ['./single-recipie-info.page.scss'],
})
export class SingleRecipieInfoPage implements OnInit {
  recipe: any;
  recipeId!: string; // Ensure recipeId exists

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipieService,
    public shoppingListService: ShoppingListService,
    private router: Router,
    private firestore: AngularFirestore,
    private location: Location
  ) {}

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id') || '';
    console.log(recipeId);
    if (!recipeId) {
      console.error('Recipe ID is missing.');
      return;
    }

    console.log('Recipe ID in SingleRecipieInfoPage:', recipeId);
    // this.recipe = this.recipeService.getRecipeDetailsById(recipeId);
    this.route.paramMap.subscribe((params) => {
      const recipeId = params.get('id');
      if (recipeId) {
        this.recipe = this.recipeService.getRecipeById(recipeId);
        console.log('Fetched Recipe:', this.recipe);
      }
    });

    console.log(this.recipe);

    if (!this.recipe) {
      console.error(`Recipe not found for ID: ${recipeId}`);
      return;
    }

    // if (recipeId) {
    //   this.recipeService.getRecipeById(recipeId).subscribe(recipe => {
    //     if (recipe) {
    //       this.recipe = recipe;
    //     } else {
    //       console.error(`Recipe not found for ID: ${recipeId}`);
    //     }
    //   });
    // }

    if (this.recipe.ingredients) {
      this.updateIngredientStatuses();
    }

    this.shoppingListService.shoppingList$.subscribe(() => {
      if (this.recipe?.ingredients) {
        this.updateIngredientStatuses();
      }
    });

    this.shoppingListService.fetchFromFirebase();
  }

  goBack() {
    this.location.back();
  }

  private updateIngredientStatuses() {
    console.log('Updating ingredient statuses:', this.recipe?.ingredients);

    if (!this.recipe?.ingredients) {
      console.error('Ingredients are undefined.');
      return;
    }

    this.recipe.ingredients = this.recipe.ingredients.map(
      (ingredient: any) => ({
        ...ingredient,
        isInList: this.isInShoppingList(ingredient),
      })
    );

    console.log('Updated ingredients:', this.recipe.ingredients);
  }

  // Check if an ingredient is in the shopping list
  isInShoppingList(ingredient: any): boolean {
    return this.shoppingListService.isInList(ingredient);
  }

  editRecipe(recipeId: string) {
    sessionStorage.setItem('previousPage', this.router.url); // Store current page
    console.log('Stored previousPage:', this.router.url);
    this.router.navigate(['/edit-recipe', recipeId]);
  }

  // navigateToEditRecipe() {
  //   const recipeId = this.recipe?.id; // Ensure the recipe has an ID
  //   if (recipeId) {
  //     sessionStorage.setItem('previousPage', this.router.url);
  //     this.router.navigate(['/edit-recipe', recipeId]); // Navigate to edit page with recipe ID
  //   }
  // }

  // togglePrivacy(recipe: any) {
  //   recipe.isPublic = !recipe.isPublic; // Toggle between public and private
  //   console.log(`Ingredient "${recipe.name}" is now ${recipe.isPublic ? 'Public' : 'Private'}`);
  // }

  togglePrivacy(recipe: any) {
    if (!recipe || !recipe.id) {
      console.error('Recipe ID is missing.');
      return;
    }

    const recipeRef = this.firestore.collection('recipes').doc(recipe.id);
    const communityRef = this.firestore
      .collection('recipeCommunity')
      .doc(recipe.id);

    const updatedPrivacy = !recipe.isPublic; // Toggle the privacy setting

    recipeRef
      .update({ isPublic: updatedPrivacy })
      .then(() => {
        recipe.isPublic = updatedPrivacy; // Update local state

        if (updatedPrivacy) {
          // If Public, add to 'recipeCommunity'
          communityRef
            .set(recipe)
            .then(() => {
              console.log('Recipe added to community.');
            })
            .catch((err) => console.error('Error adding to community:', err));
        } else {
          // If Private, remove from 'recipeCommunity'
          communityRef
            .delete()
            .then(() => {
              console.log('Recipe removed from community.');
            })
            .catch((err) =>
              console.error('Error removing from community:', err)
            );
        }
      })
      .catch((err) => console.error('Error updating recipe:', err));
  }
}
