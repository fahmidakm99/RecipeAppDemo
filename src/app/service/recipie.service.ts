import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  lastValueFrom,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './auth.service';

export interface Recipe {
  id: string;
  name: string;
  category: string[];
  ingredients: { name: string; quantity: string; unit: string }[];
  preparation: string;
  description: string;
  image?: string; // Optional, as not all recipes might have an image
  favorites: 'f' | 't';
}

@Injectable({
  providedIn: 'root',
})
export class RecipieService {
  private recipes = new BehaviorSubject<any[]>([]); // Observable for recipes
  recipes$ = this.recipes.asObservable();
  private _storage: Storage | null = null;

  private favorites = new BehaviorSubject<any[]>([]);
  favorites$ = this.favorites.asObservable();

  private recipeCommunity = new BehaviorSubject<any[]>([]);
  recipeCommunity$ = this.recipeCommunity.asObservable();

  private apiUrl =
    'https://recipe-32d20-default-rtdb.firebaseio.com/recipes.json'; // Replace with your API endpoint
  private baseUrl = 'https://recipe-32d20-default-rtdb.firebaseio.com/recipes';
  private mealplannerUrl =
    'https://recipe-32d20-default-rtdb.firebaseio.com/mealPlanner'; // Firebase Realtime Database URL

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: Storage,
    private authService: AuthService
  ) {
    this.loadLocalRecipes();
  }

  // 🔹 Get User ID (Assumes Firebase Authentication)
  async getUserId(): Promise<string | null> {
    return (await this._storage?.get('userId')) || null;
  }

  // saveRecipeToMealPlanner(
  //   userId: string,
  //   day: string,
  //   mealType: string,
  //   recipe: string
  // ): Observable<any> {
  //   const recipeData = { userId, day, mealType, recipe };
  //   console.log(recipeData);
  //   return this.http.post(
  //     `${this.mealplannerUrl}/${userId}/${day}/${mealType}.json`,
  //     recipeData
  //   );
  //   // return this.http.post(`${this.mealplannerUrl}/${userId}.json`, recipeData); // POST to Firebase
  // }
  saveRecipeToMealPlanner(
    userId: string,
    day: string,
    mealType: string,
    recipe: string
  ): Observable<any> {
    const recipeData = { recipe }; // Store only the recipe under mealType
    console.log(recipeData);

    return this.http.patch(
      `${this.mealplannerUrl}/${userId}/${day}/${mealType}.json`,
      recipeData
    );
  }

  getMealplannerRecipes(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.mealplannerUrl}/${userId}.json`).pipe(
      map((response) => {
        console.log(response);
        if (!response) return []; // If no data, return an empty array
        return Object.values(response); // Convert Firebase object to array
      })
    );
  }

  // async addRecipe(recipe: any) {
  //   try {
  //     const response: any = await this.http
  //       .post(this.apiUrl, recipe)
  //       .toPromise();
  //     const generatedId = response.name; // Firebase-generated key
  //     const updatedRecipe = { ...recipe, id: generatedId };

  //     const currentRecipes = this.recipes.getValue();
  //     this.recipes.next([...currentRecipes, updatedRecipe]);

  //     await this._storage?.set('recipes', this.recipes.getValue());
  //   } catch (error) {
  //     console.error('Error saving recipe:', error);
  //   }
  // }
  async addRecipe(recipe: Recipe) {
    try {
      const user = await this.afAuth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      // Attach userId to the recipe
      const newRecipe = { ...recipe, userId: user.uid };

      // Add recipe to Firestore
      const docRef = await this.firestore.collection('recipes').add(newRecipe);
      const generatedId = docRef.id; // Firestore-generated ID

      // Update local state with the new recipe
      const updatedRecipe = { ...newRecipe, id: generatedId };
      const currentRecipes = this.recipes.getValue();
      this.recipes.next([...currentRecipes, updatedRecipe]);

      // Save updated recipes in local storage
      await this._storage?.set('recipes', this.recipes.getValue());

      console.log('Recipe added successfully:', updatedRecipe);
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  }

  // Get the authenticated user
  async getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(null);
        }
      });
    });
  }

  // Fetch only the logged-in user's recipes
  getUserRecipes(userId: string): Observable<Recipe[]> {
    return this.firestore
      .collection<Recipe>('recipes', (ref) => ref.where('userId', '==', userId))
      .valueChanges({ idField: 'id' }) // ✅ Ensures Firestore IDs are included
      .pipe(
        map((recipes) =>
          recipes.map((recipe) => ({
            ...recipe,
            favorites: recipe.favorites ?? 'f', // Ensure favorites is never null
          }))
        ),
        tap((recipes) => console.log('Firestore returned:', recipes)),
        catchError((error) => {
          console.error('Error fetching recipes:', error);
          return of([]); // Handle errors gracefully
        })
      );
  }

  // // Load all recipes
  // async getRecipes() {
  //   try {
  //     // Fetch data from API
  //     const response: { [key: string]: any } | null = await lastValueFrom(
  //       this.http.get(this.apiUrl)
  //     );

  //     // Map over the response and add 'id' and 'ingredients' if they are not present
  //     const recipes = response
  //       ? Object.entries(response).map(([id, recipe]: [string, any]) => ({
  //           ...recipe,
  //           id,
  //           favorites: recipe.favorites || 'f', // Default to "f" if missing
  //           ingredients: recipe.ingredients || [], // Ensure ingredients is always an array
  //         }))
  //       : [];

  //     // Update the BehaviorSubject with the fetched recipes
  //     this.recipes.next(recipes);

  //     // Save the recipes in local storage
  //     await this._storage?.set('recipes', recipes);
  //     console.log(recipes); // Check if the ingredients are present in the recipe object

  //     return recipes;
  //   } catch (error) {
  //     console.error('Error fetching recipes:', error);

  //     // Fallback: Load recipes from local storage
  //   const localRecipes = await this.loadLocalRecipes();
  //   this.recipes.next(localRecipes); // Ensure local recipes are used in the BehaviorSubject
  //   console.log(localRecipes);
  //   return localRecipes;
  //     // return await this.loadLocalRecipes(); // Fallback to loading from local storage
  //   }
  // }
  async getRecipes() {
    try {
      // Load recipes from local storage
      const localRecipes = await this.loadLocalRecipes();

      // Update the BehaviorSubject with locally stored recipes
      this.recipes.next(localRecipes);

      console.log('Loaded recipes from local storage:', localRecipes);
      return localRecipes;
    } catch (error) {
      console.error('Error loading recipes from local storage:', error);
      return [];
    }
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes.next(recipes);
  }

  // Load recipes from local storage
  // private async loadLocalRecipes() {
  //   const localRecipes = (await this._storage?.get('recipes')) || [];
  //   console.log(localRecipes);
  //   this.recipes.next(localRecipes);
  //   return localRecipes;
  // }
  private async loadLocalRecipes() {
    try {
      const user = await this.afAuth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return [];
      }

      // Fetch recipes from Firestore
      const recipeDocs = await this.firestore
        .collection('recipes')
        .get()
        .toPromise();
      const firebaseRecipes = recipeDocs?.docs
        .map((doc) => {
          const data = doc.data();
          return data ? { id: doc.id, ...data } : null;
        })
        .filter((recipe) => recipe !== null) as Recipe[];

      // Save to local storage
      if (this._storage) {
        await this._storage.set('recipes', firebaseRecipes);
      }

      console.log('Loaded recipes from Firestore:', firebaseRecipes);

      // Update BehaviorSubject with fetched recipes
      this.recipes.next(firebaseRecipes);
      return firebaseRecipes;
    } catch (error) {
      console.error('Error loading recipes:', error);
      return [];
    }
  }

  // Manage Favorites
  // async addToFavorites(recipe: any) {
  //   try {
  //     // Mark the recipe as a favorite by setting the favorites field to "t"
  //     recipe.favorites = 't';

  //     // Update the recipe in Firebase
  //     await this.http
  //       .put(`${this.apiUrl.replace('.json', '')}/${recipe.id}.json`, recipe)
  //       .toPromise();

  //     // Update the local BehaviorSubject for recipes
  //     const currentRecipes = this.recipes.getValue();
  //     const updatedRecipes = currentRecipes.map((r) =>
  //       r.id === recipe.id ? { ...r, favorites: 't' } : r
  //     );
  //     this.recipes.next(updatedRecipes);

  //     // Update the favorites list
  //     const currentFavorites = this.favorites.getValue();
  //     if (!currentFavorites.some((fav) => fav.id === recipe.id)) {
  //       this.favorites.next([...currentFavorites, recipe]);
  //     }

  //     // Sync the updated recipes and favorites to local storage
  //     await this._storage?.set('recipes', updatedRecipes);
  //     await this._storage?.set('favorites', this.favorites.getValue());
  //   } catch (error) {
  //     console.error('Error adding to favorites:', error);
  //   }
  // }
  addToFavorites(recipe: any) {
    console.log('Adding to favorites:', recipe);

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userId = user.uid;
        const favoriteRef = this.firestore
          .collection(`favorites/${userId}/userFavorites`)
          .doc(recipe.id);
        console.log(recipe.favorites);
        // Set 'favorites' field to 't'
        recipe.favorites = 't';
        console.log(recipe.favorites);

        favoriteRef.get().subscribe((doc) => {
          if (doc.exists) {
            console.log('Recipe already in favorites');
          } else {
            // Save the updated recipe to Firestore with the 'favorites' field
            favoriteRef
              .set({ ...recipe, favorites: 't' })
              .then(() => console.log('Recipe added to favorites'))
              .catch((error) =>
                console.error('Error adding to favorites:', error)
              );
          }
        });
      } else {
        console.error('User not authenticated');
      }
    });
  }

  // async removeFromFavorites(recipe: any, userId: string) {
  //   try {
  //     // Mark the recipe as not a favorite by setting the favorites field to "f"
  //     recipe.favorites = 'f';

  //     // Update the recipe in Firebase
  //     await this.http
  //       .put(`${this.apiUrl.replace('.json', '')}/${recipe.id}.json`, recipe)
  //       .toPromise();

  //     // Update the local BehaviorSubject for recipes
  //     const currentRecipes = this.recipes.getValue();
  //     const updatedRecipes = currentRecipes.map((r) =>
  //       r.id === recipe.id ? { ...r, favorites: 'f' } : r
  //     );
  //     this.recipes.next(updatedRecipes);

  //     // Remove from favorites list
  //     const currentFavorites = this.favorites.getValue();
  //     this.favorites.next(
  //       currentFavorites.filter((fav) => fav.id !== recipe.id)
  //     );

  //     // Sync the updated recipes and favorites to local storage
  //     await this._storage?.set('recipes', updatedRecipes);
  //     await this._storage?.set('favorites', this.favorites.getValue());
  //   } catch (error) {
  //     console.error('Error removing from favorites:', error);
  //   }
  // }

  removeFromFavorites(recipe: any): Promise<void> {
    console.log(recipe);
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          console.log('Removing favorite:', recipe);
          const userId = user.uid;

          const favoriteRef = this.firestore
            .collection(`favorites/${userId}/userFavorites`)
            .doc(recipe.id);

          const recipeRef = this.firestore.collection('recipes').doc(recipe.id); // ✅ Reference to the recipe in main collection

          // First, update the 'favorites' field in 'recipes' collection to 'f'
          recipeRef
            .update({ favorites: 'f' })
            .then(() => {
              console.log("Updated 'favorites' field in recipes collection");

              // Then, delete the recipe from the 'favorites' collection
              return favoriteRef.delete();
            })
            .then(() => {
              recipe.favorites = 'f'; // ✅ Update local state
              console.log('Recipe removed from favorites successfully');
              resolve();
            })
            .catch((error) => {
              console.error('Error updating/removing from favorites:', error);
              reject(error);
            });
        } else {
          console.error('User not authenticated');
          reject('User not authenticated');
        }
      });
    });
  }

  removeFavorite(recipe: any) {
    console.log('Removing favorite:', recipe);
    console.log('Recipe ID:', recipe.id); // Check if this is defined

    if (!recipe.id) {
      console.error('Invalid Recipe ID! Cannot remove.');
      return;
    }

    this.removeFromFavorites(recipe);
  }







  deleteRecipeFromAllRecipe(recipe: any) {
    console.log('Removing favorite:', recipe);
    console.log('Recipe ID:', recipe.id); // Check if this is defined

    if (!recipe.id) {
      console.error('Invalid Recipe ID! Cannot remove.');
      return;
    }

    this.removeFavoriteFromAllRecipe(recipe);
    this.getRecipes(); // Reload the recipes after deletion
  }

  deleteRecipeFromAllRecipeCommunity(recipe: any){
    console.log('Removing recipe from recipecommunity:', recipe);

    if (!recipe.id) {
      console.error('Invalid Recipe ID! Cannot remove.');
      return;
    }
    this.removeFavoriteFromRecipeCommunity(recipe);
    this.getRecipes(); // Reload the recipes after deletion
  }

  removeFavoriteFromRecipeCommunity(recipe: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((user) => {
        if (!user) {
          console.error('User not authenticated');
          reject('User not authenticated');
          return;
        }
  
        console.log('Removing favorite:', recipe);
        const userId = user.uid;
  
        // const favoriteRef = this.firestore
        //   .collection(`favorites/${userId}/userFavorites`)
        //   .doc(recipe.id);
  
        const recipeRef = this.firestore.collection('recipes').doc(recipe.id);
  
        const recipeCommunityRef = this.firestore.collection('recipeCommunity/${userId}')
        .doc(recipe.id);

        // console.log('Favorite Reference:', favoriteRef);
        console.log('Recipe Reference:', recipeRef);
        console.log('recipeCommunity Reference:', recipeCommunityRef);
  
        // ✅ First, remove from 'favorites' collection
        recipeCommunityRef
          .delete()
          .then(() => {
            console.log('Recipe removed from user favorites');
  
            // ✅ Then, update the 'recipes' collection to mark as non-favorite
            return recipeRef.update({ isPublic: false });
          })
          .then(() => {
            recipe.public = false; // ✅ Update local state
            console.log('Updated "recipecommunity" field in recipes collection');
            resolve();
          })
          .catch((error) => {
            console.error('Error updating/removing from recipecommunity:', error);
            reject(error);
          });
      });
    });
  }
  

  removeFavoriteFromAllRecipe(recipe: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((user) => {
        if (!user) {
          console.error('User not authenticated');
          reject('User not authenticated');
          return;
        }
  
        console.log('Removing favorite:', recipe);
        const userId = user.uid;
  
        const favoriteRef = this.firestore
          .collection(`favorites/${userId}/userFavorites`)
          .doc(recipe.id);
  
        const recipeRef = this.firestore.collection('recipes').doc(recipe.id);
  
        // const recipeCommunityRef = this.firestore.collection('recipeCommunity').doc(recipe.id);

        console.log('Favorite Reference:', favoriteRef);
        console.log('Recipe Reference:', recipeRef);
        // console.log('recipeCommunity Reference:', recipeCommunityRef);
  
        // ✅ First, remove from 'favorites' collection
        favoriteRef
          .delete()
          .then(() => {
            console.log('Recipe removed from user favorites');
  
            // ✅ Then, update the 'recipes' collection to mark as non-favorite
            return recipeRef.update({ favorites: 'f' });
          })
          .then(() => {
            recipe.favorites = 'f'; // ✅ Update local state
            console.log('Updated "favorites" field in recipes collection');
            resolve();
          })
          .catch((error) => {
            console.error('Error updating/removing from favorites:', error);
            reject(error);
          });
      });
    });
  }
  
  isFavorite(recipe: any): boolean {
    const currentFavorites = this.favorites.getValue();

    console.log(recipe.favorites);
    return (
      currentFavorites.some((fav) => fav.id === recipe.id) ||
      recipe.favorites === 't'
    );
  }

  // fetchFavorites() {
  //   return this.http.get<{ [key: string]: any }>(this.apiUrl).pipe(
  //     map((data) => {
  //       if (!data) return [];
  //       console.log(
  //         Object.entries(data)
  //           .map(([id, recipe]) => ({ id, ...recipe }))
  //           .filter((recipe) => recipe.favorites === 't')
  //       );
  //       return Object.entries(data)
  //         .map(([id, recipe]) => ({ id, ...recipe }))
  //         .filter((recipe) => recipe.favorites === 't'); // Filter favorites marked as 't'
  //     })
  //   );
  // }
  fetchFavorites(userId: string): Observable<any[]> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection(`favorites/${user.uid}/userFavorites`)
            .valueChanges({ idField: 'id' });
        } else {
          return of([]);
        }
      })
    );
  }

  getFavorites() {
    return this.favorites$;
  }
  getRecipeById(id: string): any {
    const allRecipes = this.recipes.getValue(); // Retrieve the current list of recipes
    console.log('recipe opend', allRecipes);

    return allRecipes.find((recipe) => recipe.id === id);
  }

  getRecipeId(id: string): Observable<any> {
    console.log('recipe opend', id);
    return this.http.get<any>(`/api/recipes/${id}`); // Replace with actual API URL
  }

  // getRecipeDetailsById(id: string): Observable<Recipe | undefined> {
  //   return this.recipes.pipe(
  //     map(recipes => recipes.find(recipe => recipe.id === id))
  //   );
  // }
  getRecipeDetailsById(recipeId: string): Observable<Recipe | undefined> {
    return this.firestore
      .collection('recipes')
      .doc<Recipe>(recipeId)
      .valueChanges(); // ✅ This returns an Observable
  }

  getRecipe(id: string): Observable<Recipe | undefined> {
    return this.recipes$.pipe(
      map((recipes) => recipes.find((recipe) => recipe.id === id))
    );
  }

  async deleteRecipe(recipeId: string) {
    try {
      await this.http
        .delete(`${this.apiUrl.replace('.json', '')}/${recipeId}.json`)
        .toPromise();
      console.log('Recipe deleted');
      // Optionally update the local list of recipes after deletion
      this.getRecipes(); // Reload the recipes after deletion
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  }

  // Update recipe
  updateRecipe(recipeId: string, updatedRecipe: any) {
    return this.http
      .put(`${this.apiUrl}/${recipeId}.json`, updatedRecipe)
      .toPromise();
  }

  // updateEditRecipe(recipe: any, updatedRecipe: any): Observable<any> {
  //   console.log(recipe);
  //   if (!recipe) {
  //     throw new Error('Recipe ID is required to update the recipe.');
  //   }

  //   const url = `${this.baseUrl}/${recipe}.json`; // Correct Firebase URL structure
  //   return this.http.put(url, updatedRecipe);
  // }
  updateEditRecipe(recipeId: string, updatedRecipe: any): Promise<void> {
    console.log('Updating Recipe:', recipeId);
  
    if (!recipeId) {
      return Promise.reject(new Error('Recipe ID is required to update the recipe.'));
    }
  
    const recipeRef = this.firestore.collection('recipes').doc(recipeId);
  
    return recipeRef.update(updatedRecipe)
      .then(() => {
        console.log('Recipe updated successfully in Firestore');
      })
      .catch((error) => {
        console.error('Error updating recipe:', error);
        throw error;
      });
  }
  
  // updateEditRecipe(userId: string, recipeId: string, recipeData: any): Observable<any> {
  //   const url = `${this.baseUrl}/${userId}/recipes/${recipeId}.json`; // Ensure correct path
  //   return this.http.put(url, recipeData);
  // }

  // updateEditRecipe(userId: string, recipeId: string, updatedRecipe: any) {
  //   const url = `${this.apiUrl}/${userId}/recipes/${recipeId}.json`;
  //   return firstValueFrom(this.http.put(url, updatedRecipe));
  // }

  
}
