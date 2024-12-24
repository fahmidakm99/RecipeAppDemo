import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
// src/app/recipie.service.ts

export interface Recipe {
  id: string;
  name: string;
  category: string[];
  ingredients: { name: string; quantity: string; unit: string }[];
  preparation: string;
  description: string;
  image?: string; // Optional, as not all recipes might have an image
  favorites: string;  
}

@Injectable({
  providedIn: 'root'
})


export class RecipieService {
  getRecipesObservable() {
    throw new Error('Method not implemented.');
  }
  private recipes = new BehaviorSubject<any[]>([]);  // Observable for recipes
  recipes$ = this.recipes.asObservable();
  private _storage: Storage | null = null;

  private favorites = new BehaviorSubject<any[]>([]);
  favorites$ = this.favorites.asObservable();
  
  private apiUrl = 'https://recipe-32d20-default-rtdb.firebaseio.com/recipes.json'; // Replace with your API endpoint
  private baseUrl = 'https://recipe-32d20-default-rtdb.firebaseio.com/recipes';


  constructor(private http: HttpClient, private storage: Storage) {
    this.initStorage(); // Initialize storage
  }

  async initStorage() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.loadLocalRecipes(); // Load local recipes on initialization
  }

  // Add a new recipe
  async addRecipe(recipe: any) {
    try {
      const response: any = await this.http.post(this.apiUrl, recipe).toPromise();
      const generatedId = response.name; // Firebase returns the generated key
      const updatedRecipe = { ...recipe, id: generatedId };
  
      const currentRecipes = this.recipes.getValue();
      this.recipes.next([...currentRecipes, updatedRecipe]);
  
      await this._storage?.set('recipes', this.recipes.getValue());
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  }

  // Load all recipes
  async getRecipes() {
    try {
      // Fetch data from API
      const response: { [key: string]: any } | null = await lastValueFrom(this.http.get(this.apiUrl));
  
      // Map over the response and add 'id' and 'ingredients' if they are not present
      const recipes = response
        ? Object.entries(response).map(([id, recipe]: [string, any]) => ({
            ...recipe,
            id,
            favorites: recipe.favorites || 'f', // Default to "f" if missing
            ingredients: recipe.ingredients || [] // Ensure ingredients is always an array
          }))
        : [];
  
      // Update the BehaviorSubject with the fetched recipes
      this.recipes.next(recipes);
  
      // Save the recipes in local storage
      await this._storage?.set('recipes', recipes);
      console.log(recipes);  // Check if the ingredients are present in the recipe object

      return recipes;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return await this.loadLocalRecipes(); // Fallback to loading from local storage
    }
  }
  
  // Load recipes from local storage
  private async loadLocalRecipes() {
    const localRecipes = (await this._storage?.get('recipes')) || [];
    this.recipes.next(localRecipes);
    return localRecipes;
  }

   // Manage Favorites
   async addToFavorites(recipe: any) {
    try {
      // Mark the recipe as a favorite by setting the favorites field to "t"
      recipe.favorites = 't';
  
      // Update the recipe in Firebase
      await this.http.put(
        `${this.apiUrl.replace('.json', '')}/${recipe.id}.json`,
        recipe
      ).toPromise();
  
      // Update the local BehaviorSubject for recipes
      const currentRecipes = this.recipes.getValue();
      const updatedRecipes = currentRecipes.map((r) =>
        r.id === recipe.id ? { ...r, favorites: 't' } : r
      );
      this.recipes.next(updatedRecipes);
  
      // Update the favorites list
      const currentFavorites = this.favorites.getValue();
      if (!currentFavorites.some((fav) => fav.id === recipe.id)) {
        this.favorites.next([...currentFavorites, recipe]);
      }
  
      // Sync the updated recipes and favorites to local storage
      await this._storage?.set('recipes', updatedRecipes);
      await this._storage?.set('favorites', this.favorites.getValue());
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }
  
  async removeFromFavorites(recipe: any) {
    try {
      // Mark the recipe as not a favorite by setting the favorites field to "f"
      recipe.favorites = 'f';
  
      // Update the recipe in Firebase
      await this.http.put(
        `${this.apiUrl.replace('.json', '')}/${recipe.id}.json`,
        recipe
      ).toPromise();
  
      // Update the local BehaviorSubject for recipes
      const currentRecipes = this.recipes.getValue();
      const updatedRecipes = currentRecipes.map((r) =>
        r.id === recipe.id ? { ...r, favorites: 'f' } : r
      );
      this.recipes.next(updatedRecipes);
  
      // Remove from favorites list
      const currentFavorites = this.favorites.getValue();
      this.favorites.next(
        currentFavorites.filter((fav) => fav.id !== recipe.id)
      );
  
      // Sync the updated recipes and favorites to local storage
      await this._storage?.set('recipes', updatedRecipes);
      await this._storage?.set('favorites', this.favorites.getValue());
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }
  
  isFavorite(recipe: any): boolean {
    const currentFavorites = this.favorites.getValue();
    return currentFavorites.some((fav) => fav.id === recipe.id) || recipe.favorites === 't';
  }
  
  fetchFavorites() {
    return this.http.get<{ [key: string]: any }>(this.apiUrl).pipe(
      map((data) => {
        if (!data) return [];
        console.log(Object.entries(data).map(([id, recipe]) => ({ id, ...recipe })).filter((recipe) => recipe.favorites === 't'));
        return Object.entries(data)
          .map(([id, recipe]) => ({ id, ...recipe }))
          .filter((recipe) => recipe.favorites === 't'); // Filter favorites marked as 't'
      })
    );
  }

  getFavorites() {
    return this.favorites$;
  }
  getRecipeById(id: string): any {
    const allRecipes = this.recipes.getValue(); // Retrieve the current list of recipes
    return allRecipes.find((recipe) => recipe.id === id);
  }
  getRecipeId(id: string): Observable<any> {
    return this.http.get<any>(`/api/recipes/${id}`); // Replace with actual API URL
  }
  

 getRecipe(id: string): Observable<Recipe | undefined> {
  return this.recipes$.pipe(
    map((recipes) => recipes.find((recipe) => recipe.id === id))
  );
}

  async deleteRecipe(recipeId: string) {
    try {
      await this.http.delete(`${this.apiUrl.replace('.json', '')}/${recipeId}.json`).toPromise();
      console.log('Recipe deleted');
      // Optionally update the local list of recipes after deletion
      this.getRecipes();  // Reload the recipes after deletion
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  }
  
  
    // Update recipe
    updateRecipe(recipeId: string, updatedRecipe: any) {
      return this.http.put(`${this.apiUrl}/${recipeId}.json`, updatedRecipe).toPromise();
    }
    
    // updateEditRecipe(updatedRecipe: any): Observable<any> {
    //   return this.http.put(`${this.apiUrl}/${updatedRecipe.id}.json`, updatedRecipe); // Adjust API endpoint as needed
    // }
    updateEditRecipe(recipe: any, updatedRecipe: any): Observable<any> {
      console.log(recipe);
      if (!recipe) {
        throw new Error('Recipe ID is required to update the recipe.');
      }
    
      const url = `${this.baseUrl}/${recipe}.json`; // Correct Firebase URL structure
      return this.http.put(url, updatedRecipe);
    }

    // updateRecipe(recipeId: string, updatedRecipe: any): Observable<any> {
    //   const url = `${this.baseUrl}/${recipeId}`;
    //   return this.http.put(`${this.apiUrl}/${recipeId}.json`, updatedRecipe).toPromise();
    //   // return this.http.put(url, updatedRecipe); // Sends a PUT request to update the recipe
    // }

}
