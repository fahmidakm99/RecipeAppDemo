import { Component } from '@angular/core';
import { ShoppingListService } from '../shopping-list-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shoppingList',
  templateUrl: 'shoppingList.page.html',
  styleUrls: ['shoppingList.page.scss'],
})
export class ShoppingListPage {
  shoppingList: any[] = []; // Local variable to store the shopping list
  newItem: string = ''; // Variable to store the new item name

  constructor(
    private shoppingListService: ShoppingListService,
    private router: Router
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
  // Handle pull-to-refresh
  doRefresh(event: any) {
    console.log('Begin async operation');

    // Simulate an async operation
    setTimeout(() => {
      // Refresh logic: you can fetch updated data here
      this.shoppingList = [...this.shoppingList]; // Example refresh logic
      console.log('Async operation has ended');
      event.target.complete(); // Stop the refresher
    }, 2000);
  }
  
  removeFromShoppingList(ingredient: any) {
    this.shoppingListService.removeFromList(ingredient);
  }

  addNewItem() {
    if (this.newItem.trim()) {
      const item = { name: this.newItem.trim() };
      this.shoppingListService.addToList(item); // Add the new item to the list
      this.newItem = ''; // Clear the input field
    } else {
      console.warn('Item name cannot be empty');
    }
  }

  addToMonthly(item: any) {
    this.shoppingListService.addToMonthlyShoppingList(item);
  }

  addToWeekly(item: any) {
    this.shoppingListService.addToWeeklyShoppingList(item);
  }

  openMonthlyList() {
    this.router.navigate(['/monthly-shopping-list']);
  }

  openWeeklyList() {
    this.router.navigate(['/weekly-shopping-list']);
  }
}
