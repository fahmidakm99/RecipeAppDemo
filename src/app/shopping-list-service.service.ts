import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private shoppingList = new BehaviorSubject<any[]>([]);
  shoppingList$ = this.shoppingList.asObservable();

  private monthlyShoppingList = new BehaviorSubject<any[]>([]); // BehaviorSubject for Monthly Shopping List
  monthlyShoppingList$ = this.monthlyShoppingList.asObservable(); // Observable for the list

  private weeklyShoppingList = new BehaviorSubject<any[]>([]); // BehaviorSubject for Weekly Shopping List
  weeklyShoppingList$ = this.weeklyShoppingList.asObservable(); // Observable for the list

  private apiUrl =
    'https://recipe-32d20-default-rtdb.firebaseio.com/shoppinglist.json'; // Firebase Realtime Database URL
  private monthlyUrl =
    'https://recipe-32d20-default-rtdb.firebaseio.com/monthlyshoppinglist.json';
  private weeklyUrl =
    'https://recipe-32d20-default-rtdb.firebaseio.com/weeklyshoppinglist.json';

  private monthlyList: any[] = [];
  private weeklyList: any[] = [];

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

  private saveMonthlyToFirebase(list: any[]) {
    this.http.put(this.monthlyUrl, list).subscribe(
      () => {
        console.log('Monthly Shopping list successfully saved to Firebase.');
      },
      (error) => {
        console.error('Error saving shopping list to Firebase:', error);
      }
    );
  }
  private saveWeeklyToFirebase(list: any[]) {
    this.http.put(this.weeklyUrl, list).subscribe(
      () => {
        console.log('Weekly Shopping list successfully saved to Firebase.');
      },
      (error) => {
        console.error('Error saving shopping list to Firebase:', error);
      }
    );
  }

  getMonthlyList() {
    return this.monthlyShoppingList$;
  }

  getWeeklyList() {
    return this.weeklyList;
  }
  //monthly
  async addToMonthlyShoppingList(item: any) {
    try {
      // Step 1: Fetch the existing list from Firebase
      const existingList = await this.http
        .get<any[]>(this.monthlyUrl)
        .pipe(take(1))
        .toPromise();
      const listFromFirebase = existingList ? Object.values(existingList) : []; // Convert Firebase data to array

      // Step 2: Check for duplicates and add the new item
      if (!listFromFirebase.some((i) => i.name === item.name)) {
        listFromFirebase.push(item); // Add the new item
      }

      // Step 3: Update the BehaviorSubject
      this.monthlyList = listFromFirebase;
      this.monthlyShoppingList.next(this.monthlyList);

      // Step 4: Save the updated list to Firebase
      this.saveMonthlyToFirebase(this.monthlyList);

      console.log('Updated Monthly List:', this.monthlyList);
    } catch (error) {
      console.error('Error adding to monthly shopping list:', error);
    }
  }

  addToMonthlyList(ingredient: any) {
    const currentList = this.monthlyShoppingList.getValue();
    console.log(currentList);
    if (!currentList.some((item) => item.name === ingredient.name)) {
      const updatedList = [...currentList, ingredient];
      console.log(updatedList);
      this.monthlyShoppingList.next(updatedList);
      // this.saveToFirebase(updatedList); // Save to Firebase
      this.saveMonthlyToFirebase(updatedList);
    }
  }
  removeFromMonthlyList(ingredient: any) {
    const updatedList = this.monthlyShoppingList
      .getValue()
      .filter((item) => item.name !== ingredient.name);
    this.monthlyShoppingList.next(updatedList);
    this.saveMonthlyToFirebase(updatedList); // Save updated list to Firebase
  }
  fetchMonthlyShoppingList() {
    this.http.get<any[]>(this.monthlyUrl).subscribe(
      (data) => {
        const list = data ? Object.values(data) : []; // Convert Firebase data to an array
        this.monthlyShoppingList.next(list); // Update BehaviorSubject with fetched data
        console.log('Fetched Monthly Shopping List from Firebase:', list); // Log the fetched list
      },
      (error) => {
        console.error(
          'Error fetching monthly shopping list from Firebase:',
          error
        );
      }
    );
  }
  updateMonthlyShoppingList(list: any[]) {
    this.monthlyShoppingList.next(list); // Update BehaviorSubject
    this.http.put(this.monthlyUrl, list).subscribe(
      () => {
        console.log('Monthly Shopping List successfully updated in Firebase.');
      },
      (error) => {
        console.error(
          'Error updating monthly shopping list in Firebase:',
          error
        );
      }
    );
  }

  //weekly
  async addToWeeklyShoppingList(item: any) {
    try {
      // Step 1: Fetch the existing list from Firebase
      const existingList = await this.http
        .get<any[]>(this.weeklyUrl)
        .pipe(take(1))
        .toPromise();
      const listFromFirebase = existingList ? Object.values(existingList) : []; // Convert Firebase data to array

      // Step 2: Check for duplicates and add the new item
      if (!listFromFirebase.some((i) => i.name === item.name)) {
        listFromFirebase.push(item); // Add the new item
      }

      // Step 3: Update the BehaviorSubject
      this.weeklyList = listFromFirebase;
      this.weeklyShoppingList.next(this.weeklyList);

      // Step 4: Save the updated list to Firebase
      this.saveWeeklyToFirebase(this.weeklyList);

      console.log('Updated Monthly List:', this.weeklyList);
    } catch (error) {
      console.error('Error adding to monthly shopping list:', error);
    }
  }
  addToWeeklyList(ingredient: any) {
    const currentList = this.weeklyShoppingList.getValue();
    console.log(currentList);
    if (!currentList.some((item) => item.name === ingredient.name)) {
      const updatedList = [...currentList, ingredient];
      console.log(updatedList);
      this.weeklyShoppingList.next(updatedList);
      // this.saveToFirebase(updatedList); // Save to Firebase
      this.saveWeeklyToFirebase(updatedList);
    }
  }
  removeFromWeeklyList(ingredient: any) {
    const updatedList = this.weeklyShoppingList
      .getValue()
      .filter((item) => item.name !== ingredient.name);
    this.weeklyShoppingList.next(updatedList);
    this.saveWeeklyToFirebase(updatedList); // Save updated list to Firebase
  }
  fetchWeeklyShoppingList() {
    this.http.get<any[]>(this.weeklyUrl).subscribe(
      (data) => {
        const list = data ? Object.values(data) : []; // Convert Firebase data to an array
        this.weeklyShoppingList.next(list); // Update BehaviorSubject with fetched data
        console.log('Fetched Weekly Shopping List from Firebase:', list); // Log the fetched list
      },
      (error) => {
        console.error(
          'Error fetching weekly shopping list from Firebase:',
          error
        );
      }
    );
  }
  updateWeeklyShoppingList(list: any[]) {
    this.weeklyShoppingList.next(list); // Update BehaviorSubject
    this.http.put(this.weeklyUrl, list).subscribe(
      () => {
        console.log('Weekly Shopping List successfully updated in Firebase.');
      },
      (error) => {
        console.error(
          'Error updating Weekly shopping list in Firebase:',
          error
        );
      }
    );
  }
}
