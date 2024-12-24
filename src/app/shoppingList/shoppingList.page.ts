import { Component } from '@angular/core';
import { ShoppingListService } from '../shopping-list-service.service';

@Component({
  selector: 'app-shoppingList',
  templateUrl: 'shoppingList.page.html',
  styleUrls: ['shoppingList.page.scss']
})
export class ShoppingListPage {
  shoppingList: any[] = []; // Local variable to store the shopping list


  constructor(private shoppingListService: ShoppingListService,
  ) {}

  ngOnInit() {
   // Fetch shopping list from Firebase on component initialization
   this.shoppingListService.fetchFromFirebase();

    // Subscribe to shoppingList$ to keep the component in sync with the service
    this.shoppingListService.shoppingList$.subscribe((list) => {
      this.shoppingList = list; // Update local variable whenever the service changes
      console.log('Shopping List:', this.shoppingList);
    });
  }
  
  removeFromShoppingList(ingredient: any) {
    this.shoppingListService.removeFromList(ingredient);
  }

}
