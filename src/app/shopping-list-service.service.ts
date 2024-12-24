import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private shoppingList = new BehaviorSubject<any[]>([]);
  shoppingList$ = this.shoppingList.asObservable();

  private apiUrl = 'https://recipe-32d20-default-rtdb.firebaseio.com/shoppinglist.json'; // Firebase Realtime Database URL

  constructor(private http: HttpClient) {}

  // Add an ingredient to the shopping list
  addToList(ingredient: any) {
    const currentList = this.shoppingList.getValue();
    if (!currentList.some((item) => item.name === ingredient.name)) {
      const updatedList = [...currentList, ingredient];
      this.shoppingList.next(updatedList);
      this.saveToFirebase(updatedList); // Save to Firebase
    }
  }

  // Remove an ingredient from the shopping list
  removeFromList(ingredient: any) {
    const updatedList = this.shoppingList
      .getValue()
      .filter((item) => item.name !== ingredient.name);
    this.shoppingList.next(updatedList);
    this.saveToFirebase(updatedList); // Save updated list to Firebase
  }

  // Check if an ingredient is in the list
  isInList(ingredient: any): boolean {
    return this.shoppingList
      .getValue()
      .some((item) => item.name === ingredient.name);
  }
 // Check if an ingredient is in the shopping list
 isInShoppingList(ingredient: any): boolean {
  return this.shoppingList
    .getValue()
    .some((item) => item.name === ingredient.name);
}
// Toggle ingredient in the shopping list
  toggleIngredient(ingredient: any) {
    if (this.isInShoppingList(ingredient)) {
      this.removeFromList(ingredient);
    } else {
      this.addToList(ingredient);
    }
  }
  // Fetch shopping list from Firebase
  fetchFromFirebase() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        const list = data ? Object.values(data) : []; // Convert Firebase data to array
        this.shoppingList.next(list);
      },
      (error) => {
        console.error('Error fetching shopping list from Firebase:', error);
      }
    );
  }

  // Save the shopping list to Firebase
  private saveToFirebase(list: any[]) {
    this.http.put(this.apiUrl, list).subscribe(
      () => {
        console.log('Shopping list successfully saved to Firebase.');
      },
      (error) => {
        console.error('Error saving shopping list to Firebase:', error);
      }
    );
  }

  // Update the shopping list directly (if fetched externally)
  updateShoppingList(data: any[]) {
    this.shoppingList.next(data);
    this.saveToFirebase(data); // Sync with Firebase
  }
}
