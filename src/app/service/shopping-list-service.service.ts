// import { Injectable } from '@angular/core';
// import { BehaviorSubject, map, Observable, take } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class ShoppingListService {

//   userId: string | null = null; // Store logged-in user ID


//   private shoppingList = new BehaviorSubject<any[]>([]);
//   shoppingList$ = this.shoppingList.asObservable();

//   private monthlyShoppingList = new BehaviorSubject<any[]>([]); // BehaviorSubject for Monthly Shopping List
//   monthlyShoppingList$ = this.monthlyShoppingList.asObservable(); // Observable for the list

//   private weeklyShoppingList = new BehaviorSubject<any[]>([]); // BehaviorSubject for Weekly Shopping List
//   weeklyShoppingList$ = this.weeklyShoppingList.asObservable(); // Observable for the list

//   private apiUrl =
//     'https://recipe-32d20-default-rtdb.firebaseio.com/shoppinglist.json'; // Firebase Realtime Database URL
//   private monthlyUrl =
//     'https://recipe-32d20-default-rtdb.firebaseio.com/monthlyshoppinglist.json';
//   private weeklyUrl =
//     'https://recipe-32d20-default-rtdb.firebaseio.com/weeklyshoppinglist.json';

//   private monthlyList: any[] = [];
//   private weeklyList: any[] = [];

//   constructor(private http: HttpClient,
//     private firestore: AngularFirestore, private authService: AuthService
//   ) {
//   // Get logged-in user ID
//   this.authService.getCurrentUser().subscribe((userId) => {
//     this.userId = userId;
//   });
// }

//   // Add an ingredient to the shopping list
//   addToList(ingredient: any) {
//     const currentList = this.shoppingList.getValue();
//     if (!currentList.some((item) => item.name === ingredient.name)) {
//       const updatedList = [...currentList, ingredient];
//       this.shoppingList.next(updatedList);
//       this.saveToFirebase(updatedList); // Save to Firebase
//     }
//   }

//   // // Remove an ingredient from the shopping list
//   // removeFromList(ingredient: any) {
//   //   const updatedList = this.shoppingList
//   //     .getValue()
//   //     .filter((item) => item.name !== ingredient.name);
//   //   this.shoppingList.next(updatedList);
//   //   this.saveToFirebase(updatedList); // Save updated list to Firebase
//   // }
// // Remove an ingredient from the shopping list (Firestore)
// removeFromList(ingredient: any) {
//   if (!this.userId) {
//     console.error('User not logged in. Cannot remove item.');
//     return;
//   }

//   const shoppingListRef = this.firestore.collection(`users/${this.userId}/shoppingList`);

//   // Find and delete the matching document in Firestore
//   shoppingListRef.ref.where('name', '==', ingredient.name).get().then((snapshot) => {
//     snapshot.forEach((doc) => {
//       doc.ref.delete()
//         .then(() => console.log(`Removed '${ingredient.name}' from shopping list.`))
//         .catch((error) => console.error('Error removing item:', error));
//     });

//     // Update local shopping list state
//     const updatedList = this.shoppingList.getValue().filter((item) => item.name !== ingredient.name);
//     this.shoppingList.next(updatedList);
//   }).catch((error) => {
//     console.error('Error fetching shopping list item:', error);
//   });
// }


//   // Check if an ingredient is in the list
//   isInList(ingredient: any): boolean {
//     return this.shoppingList
//       .getValue()
//       .some((item) => item.name === ingredient.name);
//   }
//   // Check if an ingredient is in the shopping list
//   isInShoppingList(ingredient: any): boolean {
//     return this.shoppingList
//       .getValue()
//       .some((item) => item.name === ingredient.name);
//   }
//   // Toggle ingredient in the shopping list
//   toggleIngredient(ingredient: any) {
//     if (this.isInShoppingList(ingredient)) {
//       this.removeFromList(ingredient);
//     } else {
//       this.addToList(ingredient);
//     }
//   }
//   // Fetch shopping list from Firebase
//   // fetchFromFirebase() {
//   //   this.http.get<any[]>(this.apiUrl).subscribe(
//   //     (data) => {
//   //       const list = data ? Object.values(data) : []; // Convert Firebase data to array
//   //       this.shoppingList.next(list);
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching shopping list from Firebase:', error);
//   //     }
//   //   );
//   // }
//   // fetchFromFirebase() {
//   //   this.http.get<{ [key: string]: any } | null>(this.apiUrl).subscribe(
//   //     (data) => {
//   //       console.log('Fetched Shopping List Data:', data); // Debugging step
  
//   //       if (data && typeof data === 'object') {
//   //         const list = Object.values(data); // Convert Firebase object to array
//   //         this.shoppingList.next(list);
//   //         console.log('Updated Shopping List:', list);
//   //       } else {
//   //         this.shoppingList.next([]); // No data case
//   //         console.log('No shopping list data found.');
//   //       }
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching shopping list:', error);
//   //     }
//   //   );
//   // }
//   fetchFromFirebase() {
//     if (!this.userId) {
//       console.error('User not logged in. Cannot fetch shopping list.');
//       return;
//     }
  
//     const shoppingListRef = this.firestore.collection(`users/${this.userId}/shoppingList`);
  
//     shoppingListRef.snapshotChanges().subscribe(
//       (snapshot) => {
//         const shoppingList = snapshot.map(doc => ({
//           id: doc.payload.doc.id, // Store document ID for future updates/deletes
//           ...doc.payload.doc.data() as any
//         }));
  
//         this.shoppingList.next(shoppingList);
//         console.log('Fetched Shopping List:', shoppingList);
//       },
//       (error) => {
//         console.error('Error fetching shopping list:', error);
//       }
//     );
//   }
  
  

//   // // Save the shopping list to Firebase
//   // private saveToFirebase(list: any[]) {
//   //   this.http.put(this.apiUrl, list).subscribe(
//   //     () => {
//   //       console.log('Shopping list successfully saved to Firebase.');
//   //     },
//   //     (error) => {
//   //       console.error('Error saving shopping list to Firebase:', error);
//   //     }
//   //   );
//   // }
//   // Save shopping list to Firestore under the user's collection
//   saveToFirebase(list: any[]) {
//     if (!this.userId) {
//       console.error('User not logged in. Cannot save shopping list.');
//       return;
//     }

//     const shoppingListRef = this.firestore.collection(`users/${this.userId}/shoppingList`);

//     // Delete old items before saving new ones
//     shoppingListRef.get().subscribe((snapshot) => {
//       snapshot.forEach((doc) => doc.ref.delete());

//       // Add new items
//       list.forEach((item) => {
//         shoppingListRef.add(item)
//           .then(() => console.log('Shopping list item saved:', item))
//           .catch((error) => console.error('Error saving shopping list item:', error));
//       });
//     });
//   }

//   // Update the shopping list directly (if fetched externally)
//   updateShoppingList(data: any[]) {
//     this.shoppingList.next(data);
//     this.saveToFirebase(data); // Sync with Firebase
//   }

//   // private saveMonthlyToFirebase(list: any[]) {
//   //   const MonthlyshoppingListRef = this.firestore.collection(`users/${this.userId}/MonthlyshoppingList`);

//   //   this.http.put(this.monthlyUrl, list).subscribe(
//   //     () => {
//   //       console.log('Monthly Shopping list successfully saved to Firebase.');
//   //     },
//   //     (error) => {
//   //       console.error('Error saving shopping list to Firebase:', error);
//   //     }
//   //   );
//   // }
//   // private saveWeeklyToFirebase(list: any[]) {
//   //   this.http.put(this.weeklyUrl, list).subscribe(
//   //     () => {
//   //       console.log('Weekly Shopping list successfully saved to Firebase.');
//   //     },
//   //     (error) => {
//   //       console.error('Error saving shopping list to Firebase:', error);
//   //     }
//   //   );
//   // }
//   saveMonthlyToFirebase(list: any[]) {
//     if (!this.userId) {
//       console.error('User not logged in. Cannot save monthly shopping list.');
//       return;
//     }
  
//     const monthlyListRef = this.firestore.collection(`users/${this.userId}/monthlyShoppingList`);
  
//     // Delete old items before saving new ones
//     monthlyListRef.get().subscribe((snapshot) => {
//       snapshot.forEach((doc) => doc.ref.delete());
  
//       // Add new items
//       list.forEach((item) => {
//         monthlyListRef.add(item)
//           .then(() => console.log('Monthly shopping list item saved:', item))
//           .catch((error) => console.error('Error saving monthly shopping list item:', error));
//       });
//     });
//   }
//   saveWeeklyToFirebase(list: any[]) {
//     if (!this.userId) {
//       console.error('User not logged in. Cannot save weekly shopping list.');
//       return;
//     }
  
//     const weeklyListRef = this.firestore.collection(`users/${this.userId}/weeklyShoppingList`);
  
//     // Delete old items before saving new ones
//     weeklyListRef.get().subscribe((snapshot) => {
//       snapshot.forEach((doc) => doc.ref.delete());
  
//       // Add new items
//       list.forEach((item) => {
//         weeklyListRef.add(item)
//           .then(() => console.log('Weekly shopping list item saved:', item))
//           .catch((error) => console.error('Error saving weekly shopping list item:', error));
//       });
//     });
//   }
    
//   getMonthlyList() {
//     return this.monthlyShoppingList$;
//   }

//   getWeeklyList() {
//     return this.weeklyList;
//   }
//   //monthly
//   async addToMonthlyShoppingList(item: any) {
//     try {
//       // Step 1: Fetch the existing list from Firebase
//       const existingList = await this.http
//         .get<any[]>(this.monthlyUrl)
//         .pipe(take(1))
//         .toPromise();
//       const listFromFirebase = existingList ? Object.values(existingList) : []; // Convert Firebase data to array

//       // Step 2: Check for duplicates and add the new item
//       if (!listFromFirebase.some((i) => i.name === item.name)) {
//         listFromFirebase.push(item); // Add the new item
//       }

//       // Step 3: Update the BehaviorSubject
//       this.monthlyList = listFromFirebase;
//       this.monthlyShoppingList.next(this.monthlyList);

//       // Step 4: Save the updated list to Firebase
//       this.saveMonthlyToFirebase(this.monthlyList);

//       console.log('Updated Monthly List:', this.monthlyList);
//     } catch (error) {
//       console.error('Error adding to monthly shopping list:', error);
//     }
//   }

//   addToMonthlyList(ingredient: any) {
//     const currentList = this.monthlyShoppingList.getValue();
//     console.log(currentList);
//     if (!currentList.some((item) => item.name === ingredient.name)) {
//       const updatedList = [...currentList, ingredient];
//       console.log(updatedList);
//       this.monthlyShoppingList.next(updatedList);
//       // this.saveToFirebase(updatedList); // Save to Firebase
//       this.saveMonthlyToFirebase(updatedList);
//     }
//   }
//   removeFromMonthlyList(ingredient: any) {
//     const updatedList = this.monthlyShoppingList
//       .getValue()
//       .filter((item) => item.name !== ingredient.name);
//     this.monthlyShoppingList.next(updatedList);
//     this.saveMonthlyToFirebase(updatedList); // Save updated list to Firebase
//   }
//   // fetchMonthlyShoppingList() {
//   //   this.http.get<any[]>(this.monthlyUrl).subscribe(
//   //     (data) => {
//   //       const list = data ? Object.values(data) : []; // Convert Firebase data to an array
//   //       this.monthlyShoppingList.next(list); // Update BehaviorSubject with fetched data
//   //       console.log('Fetched Monthly Shopping List from Firebase:', list); // Log the fetched list
//   //     },
//   //     (error) => {
//   //       console.error(
//   //         'Error fetching monthly shopping list from Firebase:',
//   //         error
//   //       );
//   //     }
//   //   );
//   // }
//   fetchMonthlyShoppingList() {
//     if (!this.userId) {
//       console.error('User not logged in. Cannot fetch monthly shopping list.');
//       return;
//     }
  
//     const monthlyListRef = this.firestore.collection(`users/${this.userId}/monthlyShoppingList`);
  
//     monthlyListRef.snapshotChanges().subscribe(
//       (snapshot) => {
//         const monthlyShoppingList = snapshot.map(doc => ({
//           id: doc.payload.doc.id, // Store document ID for future updates/deletes
//           ...doc.payload.doc.data() as any
//         }));
  
//         this.monthlyShoppingList.next(monthlyShoppingList);
//         console.log('Fetched Monthly Shopping List:', monthlyShoppingList);
//       },
//       (error) => {
//         console.error('Error fetching monthly shopping list:', error);
//       }
//     );
//   }
  
//   // updateMonthlyShoppingList(list: any[]) {
//   //   this.monthlyShoppingList.next(list); // Update BehaviorSubject
//   //   this.http.put(this.monthlyUrl, list).subscribe(
//   //     () => {
//   //       console.log('Monthly Shopping List successfully updated in Firebase.');
//   //     },
//   //     (error) => {
//   //       console.error(
//   //         'Error updating monthly shopping list in Firebase:',
//   //         error
//   //       );
//   //     }
//   //   );
//   // }
//   updateMonthlyShoppingList(list: any[]) {
//     if (!this.userId) {
//       console.error('User not logged in. Cannot update monthly shopping list.');
//       return;
//     }
  
//     const monthlyListRef = this.firestore.collection(`users/${this.userId}/monthlyShoppingList`);
  
//     // First, clear the existing list before updating
//     monthlyListRef.get().subscribe((snapshot) => {
//       snapshot.forEach((doc) => doc.ref.delete());
  
//       // Now, add the updated list items
//       list.forEach((item) => {
//         monthlyListRef.add(item)
//           .then(() => console.log('Monthly Shopping List item updated:', item))
//           .catch((error) => console.error('Error updating Monthly shopping list:', error));
//       });
  
//       // Update the BehaviorSubject with the new list
//       this.monthlyShoppingList.next(list);
//     });
//   }
  

//   //weekly
//   async addToWeeklyShoppingList(item: any) {
//     try {
//       // Step 1: Fetch the existing list from Firebase
//       const existingList = await this.http
//         .get<any[]>(this.weeklyUrl)
//         .pipe(take(1))
//         .toPromise();
//       const listFromFirebase = existingList ? Object.values(existingList) : []; // Convert Firebase data to array

//       // Step 2: Check for duplicates and add the new item
//       if (!listFromFirebase.some((i) => i.name === item.name)) {
//         listFromFirebase.push(item); // Add the new item
//       }

//       // Step 3: Update the BehaviorSubject
//       this.weeklyList = listFromFirebase;
//       this.weeklyShoppingList.next(this.weeklyList);

//       // Step 4: Save the updated list to Firebase
//       this.saveWeeklyToFirebase(this.weeklyList);

//       console.log('Updated Monthly List:', this.weeklyList);
//     } catch (error) {
//       console.error('Error adding to monthly shopping list:', error);
//     }
//   }
//   addToWeeklyList(ingredient: any) {
//     const currentList = this.weeklyShoppingList.getValue();
//     console.log(currentList);
//     if (!currentList.some((item) => item.name === ingredient.name)) {
//       const updatedList = [...currentList, ingredient];
//       console.log(updatedList);
//       this.weeklyShoppingList.next(updatedList);
//       // this.saveToFirebase(updatedList); // Save to Firebase
//       this.saveWeeklyToFirebase(updatedList);
//     }
//   }
//   removeFromWeeklyList(ingredient: any) {
//     const updatedList = this.weeklyShoppingList
//       .getValue()
//       .filter((item) => item.name !== ingredient.name);
//     this.weeklyShoppingList.next(updatedList);
//     this.saveWeeklyToFirebase(updatedList); // Save updated list to Firebase
//   }
//   // fetchWeeklyShoppingList() {
//   //   this.http.get<any[]>(this.weeklyUrl).subscribe(
//   //     (data) => {
//   //       const list = data ? Object.values(data) : []; // Convert Firebase data to an array
//   //       this.weeklyShoppingList.next(list); // Update BehaviorSubject with fetched data
//   //       console.log('Fetched Weekly Shopping List from Firebase:', list); // Log the fetched list
//   //     },
//   //     (error) => {
//   //       console.error(
//   //         'Error fetching weekly shopping list from Firebase:',
//   //         error
//   //       );
//   //     }
//   //   );
//   // }
//   fetchWeeklyShoppingList() {
//     if (!this.userId) {
//       console.error('User not logged in. Cannot fetch weekly shopping list.');
//       return;
//     }
  
//     const weeklyListRef = this.firestore.collection(`users/${this.userId}/weeklyShoppingList`);
  
//     weeklyListRef.snapshotChanges().subscribe(
//       (snapshot) => {
//         const weeklyShoppingList = snapshot.map(doc => ({
//           id: doc.payload.doc.id, // Store document ID for future updates/deletes
//           ...doc.payload.doc.data() as any
//         }));
  
//         this.weeklyShoppingList.next(weeklyShoppingList);
//         console.log('Fetched Weekly Shopping List:', weeklyShoppingList);
//       },
//       (error) => {
//         console.error('Error fetching weekly shopping list:', error);
//       }
//     );
//   }
  
//   // updateWeeklyShoppingList(list: any[]) {
//   //   this.weeklyShoppingList.next(list); // Update BehaviorSubject
//   //   this.http.put(this.weeklyUrl, list).subscribe(
//   //     () => {
//   //       console.log('Weekly Shopping List successfully updated in Firebase.');
//   //     },
//   //     (error) => {
//   //       console.error(
//   //         'Error updating Weekly shopping list in Firebase:',
//   //         error
//   //       );
//   //     }
//   //   );
//   // }
//   updateWeeklyShoppingList(list: any[]) {
//     if (!this.userId) {
//       console.error('User not logged in. Cannot update weekly shopping list.');
//       return;
//     }
  
//     const weeklyListRef = this.firestore.collection(`users/${this.userId}/weeklyShoppingList`);
  
//     // First, clear the existing list before updating
//     weeklyListRef.get().subscribe((snapshot) => {
//       snapshot.forEach((doc) => doc.ref.delete());
  
//       // Now, add the updated list items
//       list.forEach((item) => {
//         weeklyListRef.add(item)
//           .then(() => console.log('Weekly Shopping List item updated:', item))
//           .catch((error) => console.error('Error updating Weekly shopping list:', error));
//       });
  
//       // Update the BehaviorSubject with the new list
//       this.weeklyShoppingList.next(list);
//     });
//   }
  
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {

  userId: string | null = null; // Store logged-in user ID


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

  constructor(private http: HttpClient,
    private firestore: AngularFirestore, private authService: AuthService
  ) {
  // Get logged-in user ID
  // this.authService.getCurrentUser().subscribe((userId) => {
  //   this.userId = userId;
  // });
  this.authService.getCurrentUser().subscribe((userId) => {
    if (userId) {
      this.userId = userId;
      this.fetchFromFirebase();  // Manually fetch once user is logged in
    }
  });
  
}

  // Add an ingredient to the shopping list
  addToList(ingredient: any) {
    const currentList = this.shoppingList.getValue();
    if (!currentList.some((item) => item.name === ingredient.name)) {
      const updatedList = [...currentList, ingredient];
      this.shoppingList.next(updatedList);
      this.saveToFirebase(updatedList); // Save to Firebase
    }
  }

// Remove an ingredient from the shopping list (Firestore)
removeFromList(ingredient: any) {
  if (!this.userId) {
    console.error('User not logged in. Cannot remove item.');
    return;
  }

  const shoppingListRef = this.firestore.collection(`users/${this.userId}/shoppingList`);

  // Find and delete the matching document in Firestore
  shoppingListRef.ref.where('name', '==', ingredient.name).get().then((snapshot) => {
    snapshot.forEach((doc) => {
      doc.ref.delete()
        .then(() => console.log(`Removed '${ingredient.name}' from shopping list.`))
        .catch((error) => console.error('Error removing item:', error));
    });

    // Update local shopping list state
    const updatedList = this.shoppingList.getValue().filter((item) => item.name !== ingredient.name);
    this.shoppingList.next(updatedList);
  }).catch((error) => {
    console.error('Error fetching shopping list item:', error);
  });
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
  
  // fetchFromFirebase() {
  //   if (!this.userId) {
  //     console.error('User not logged in. Cannot fetch shopping list.');
  //     return;
  //   }
  
  //   const shoppingListRef = this.firestore.collection(`users/${this.userId}/shoppingList`);
  
  //   shoppingListRef.snapshotChanges().subscribe(
  //     (snapshot) => {
  //       const shoppingList = snapshot.map(doc => ({
  //         id: doc.payload.doc.id, // Store document ID for future updates/deletes
  //         ...doc.payload.doc.data() as any
  //       }));
  
  //       this.shoppingList.next(shoppingList);
  //       console.log('Fetched Shopping List:', shoppingList);
  //     },
  //     (error) => {
  //       console.error('Error fetching shopping list:', error);
  //     }
  //   );
  // }
  fetchFromFirebase() {
    this.authService.getCurrentUser().subscribe((userId) => {
      if (!userId) {
        console.error('User not logged in. Cannot fetch shopping list.');
        return;
      }
  
      this.userId = userId; // Ensure userId is set
  
      const shoppingListRef = this.firestore.collection(`users/${this.userId}/shoppingList`);
  
      shoppingListRef.snapshotChanges().subscribe(
        (snapshot) => {
          const shoppingList = snapshot.map(doc => ({
            id: doc.payload.doc.id, // Store document ID for future updates/deletes
            ...doc.payload.doc.data() as any
          }));
  
          this.shoppingList.next(shoppingList);
          console.log('Fetched Shopping List:', shoppingList);
        },
        (error) => {
          console.error('Error fetching shopping list:', error);
        }
      );
    });
  }
  
  
    // Save shopping list to Firestore under the user's collection
  saveToFirebase(list: any[]) {
    if (!this.userId) {
      console.error('User not logged in. Cannot save shopping list.');
      return;
    }

    const shoppingListRef = this.firestore.collection(`users/${this.userId}/shoppingList`);

    // Delete old items before saving new ones
    shoppingListRef.get().subscribe((snapshot) => {
      snapshot.forEach((doc) => doc.ref.delete());

      // Add new items
      list.forEach((item) => {
        shoppingListRef.add(item)
          .then(() => console.log('Shopping list item saved:', item))
          .catch((error) => console.error('Error saving shopping list item:', error));
      });
    });
  }

  // Update the shopping list directly (if fetched externally)
  updateShoppingList(data: any[]) {
    this.shoppingList.next(data);
    this.saveToFirebase(data); // Sync with Firebase
  }


  // saveMonthlyToFirebase(list: any[]) {
  //   if (!this.userId) {
  //     console.error('User not logged in. Cannot save monthly shopping list.');
  //     return;
  //   }
  
  //   const monthlyListRef = this.firestore.collection(`users/${this.userId}/monthlyShoppingList`);
  
  //   list.forEach((item) => {
  //     monthlyListRef.ref.where('name', '==', item.name).get().then((snapshot) => {
  //       if (snapshot.empty) {
  //         // Only add if the item does not exist
  //         monthlyListRef.add(item)
  //           .then(() => console.log('Monthly shopping list item saved:', item))
  //           .catch((error) => console.error('Error saving Monthly shopping list item:', error));
  //       } else {
  //         console.log(`Item '${item.name}' already exists in the Monthly shopping list.`);
  //       }
  //     });
  //   });
  // }
  saveMonthlyToFirebase(list: any[]) {
    if (!this.userId) {
      console.error('User not logged in. Cannot save monthly shopping list.');
      return;
    }
  
    const monthlyListRef = this.firestore.collection(`users/${this.userId}/monthlyShoppingList`);
  
    this.firestore.firestore.runTransaction(async (transaction) => {
      const snapshot = await monthlyListRef.ref.get();
      
      // Delete existing items
      snapshot.forEach((doc) => transaction.delete(doc.ref));
  
      // Add new items
      list.forEach((item) => {
        const newItemRef = monthlyListRef.doc(); // Generate a new document reference
        transaction.set(newItemRef.ref, item);

      });
  
      console.log('Updated Monthly Shopping List:', list);
    }).catch((error) => {
      console.error('Error updating monthly shopping list:', error);
    });
  }
  
  
  
  saveWeeklyToFirebase(list: any[]) {
    if (!this.userId) {
      console.error('User not logged in. Cannot save weekly shopping list.');
      return;
    }
  
    const weeklyListRef = this.firestore.collection(`users/${this.userId}/weeklyShoppingList`);
  
  //   list.forEach((item) => {
  //     weeklyListRef.ref.where('name', '==', item.name).get().then((snapshot) => {
  //       if (snapshot.empty) {
  //         // Only add if the item does not exist
  //         weeklyListRef.add(item)
  //           .then(() => console.log('Weekly shopping list item saved:', item))
  //           .catch((error) => console.error('Error saving weekly shopping list item:', error));
  //       } else {
  //         console.log(`Item '${item.name}' already exists in the weekly shopping list.`);
  //       }
  //     });
  //   });
  // }
  this.firestore.firestore.runTransaction(async (transaction) => {
    const snapshot = await weeklyListRef.ref.get();
    
    // Delete existing items
    snapshot.forEach((doc) => transaction.delete(doc.ref));

    // Add new items
    list.forEach((item) => {
      const newItemRef = weeklyListRef.doc(); // Generate a new document reference
      transaction.set(newItemRef.ref, item);

    });

    console.log('Updated Monthly Shopping List:', list);
  }).catch((error) => {
    console.error('Error updating monthly shopping list:', error);
  });
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

  // fetchMonthlyShoppingList() {
  //   if (!this.userId) {
  //     console.error('User not logged in. Cannot fetch monthly shopping list.');
  //     return;
  //   }
  
  //   const monthlyListRef = this.firestore.collection(`users/${this.userId}/monthlyShoppingList`);
  
  //   monthlyListRef.snapshotChanges().subscribe(
  //     (snapshot) => {
  //       const monthlyShoppingList = snapshot.map(doc => ({
  //         id: doc.payload.doc.id, // Store document ID for future updates/deletes
  //         ...doc.payload.doc.data() as any
  //       }));
  
  //       this.monthlyShoppingList.next(monthlyShoppingList);
  //       console.log('Fetched Monthly Shopping List:', monthlyShoppingList);
  //     },
  //     (error) => {
  //       console.error('Error fetching monthly shopping list:', error);
  //     }
  //   );
  // }
  fetchMonthlyShoppingList() {
    if (!this.userId) {
      console.error('User not logged in. Cannot fetch monthly shopping list.');
      return;
    }
  
    const monthlyListRef = this.firestore.collection(`users/${this.userId}/monthlyShoppingList`);
  
    monthlyListRef.valueChanges().subscribe(
      (monthlyShoppingList) => {
        this.monthlyShoppingList.next(monthlyShoppingList);
        console.log('Fetched Monthly Shopping List:', monthlyShoppingList);
      },
      (error) => {
        console.error('Error fetching monthly shopping list:', error);
      }
    );
  }
  

  updateMonthlyShoppingList(list: any[]) {
    if (!this.userId) {
      console.error('User not logged in. Cannot update monthly shopping list.');
      return;
    }
  
    const monthlyListRef = this.firestore.collection(`users/${this.userId}/monthlyShoppingList`);
  
    // First, clear the existing list before updating
    monthlyListRef.get().subscribe((snapshot) => {
      snapshot.forEach((doc) => doc.ref.delete());
  
      // Now, add the updated list items
      list.forEach((item) => {
        monthlyListRef.add(item)
          .then(() => console.log('Monthly Shopping List item updated:', item))
          .catch((error) => console.error('Error updating Monthly shopping list:', error));
      });
  
      // Update the BehaviorSubject with the new list
      this.monthlyShoppingList.next(list);
    });
  }
  

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
    if (!this.userId) {
      console.error('User not logged in. Cannot fetch weekly shopping list.');
      return;
    }
  
    const weeklyListRef = this.firestore.collection(`users/${this.userId}/weeklyShoppingList`);
  
    weeklyListRef.snapshotChanges().subscribe(
      (snapshot) => {
        const weeklyShoppingList = snapshot.map(doc => ({
          id: doc.payload.doc.id, // Store document ID for future updates/deletes
          ...doc.payload.doc.data() as any
        }));
  
        this.weeklyShoppingList.next(weeklyShoppingList);
        console.log('Fetched Weekly Shopping List:', weeklyShoppingList);
      },
      (error) => {
        console.error('Error fetching weekly shopping list:', error);
      }
    );
  }

  updateWeeklyShoppingList(list: any[]) {
    if (!this.userId) {
      console.error('User not logged in. Cannot update weekly shopping list.');
      return;
    }
  
    const weeklyListRef = this.firestore.collection(`users/${this.userId}/weeklyShoppingList`);
  
    // First, clear the existing list before updating
    weeklyListRef.get().subscribe((snapshot) => {
      snapshot.forEach((doc) => doc.ref.delete());
  
      // Now, add the updated list items
      list.forEach((item) => {
        weeklyListRef.add(item)
          .then(() => console.log('Weekly Shopping List item updated:', item))
          .catch((error) => console.error('Error updating Weekly shopping list:', error));
      });
  
      // Update the BehaviorSubject with the new list
      this.weeklyShoppingList.next(list);
    });
  }
  
}
