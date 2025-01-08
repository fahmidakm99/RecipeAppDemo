import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../shopping-list-service.service';

@Component({
  selector: 'app-weekly-shopping-list',
  templateUrl: './weekly-shopping-list.page.html',
  styleUrls: ['./weekly-shopping-list.page.scss'],
})
export class WeeklyShoppingListPage implements OnInit {

  weeklyList: any[] = [];
  newItem: string = ''; // Variable to store the new item name

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    // this.weeklyList = this.shoppingListService.getWeeklyList();
    console.log('ngOnInit executed');
    this.loadWeeklyList();
  }
  loadWeeklyList() {
    // Fetch the monthly shopping list from localStorage and update BehaviorSubject
    const fetchlist=  this.shoppingListService.fetchWeeklyShoppingList();
    console.log("fetchlist: ",fetchlist);
    // Subscribe to monthlyShoppingList$ to get the updated list
    this.shoppingListService.weeklyShoppingList$.subscribe((list) => {
      
      this.weeklyList = list;
      console.log('added Weekly List:', this.weeklyList);
    });
  }
  addNewItem() {
    if (this.newItem.trim()) {
      const item = { name: this.newItem.trim() };
      this.shoppingListService.addToWeeklyList(item); // Add the new item to the list
      this.newItem = ''; // Clear the input field
    } else {
      console.warn('Item name cannot be empty');
    }
  }
  removeFromWeeklyShoppingList(ingredient: any) {
    this.shoppingListService.removeFromWeeklyList(ingredient);
  }
}
