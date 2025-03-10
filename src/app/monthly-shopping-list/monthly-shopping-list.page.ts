import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShoppingListService } from '../service/shopping-list-service.service';

@Component({
  selector: 'app-monthly-shopping-list',
  templateUrl: './monthly-shopping-list.page.html',
  styleUrls: ['./monthly-shopping-list.page.scss'],
})
export class MonthlyShoppingListPage implements OnInit {

  monthlyList: any[] = [];
  newItem: string = ''; // Variable to store the new item name

  constructor(
    private shoppingListService: ShoppingListService,
  ) {}

  ngOnInit() {
    console.log('ngOnInit executed');
    this.loadMonthlyList();
  }
  loadMonthlyList() {
    // Fetch the monthly shopping list from localStorage and update BehaviorSubject
    const fetchlist=  this.shoppingListService.fetchMonthlyShoppingList();
    console.log("fetchlist: ",fetchlist);
    // Subscribe to monthlyShoppingList$ to get the updated list
    this.shoppingListService.monthlyShoppingList$.subscribe((list) => {
      
      this.monthlyList = list;
      console.log('added Monthly List:', this.monthlyList);
    });
  }

  addNewItem() {
    if (this.newItem.trim()) {
      const item = { name: this.newItem.trim() };
      this.shoppingListService.addToMonthlyList(item); // Add the new item to the list
      this.newItem = ''; // Clear the input field
    } else {
      console.warn('Item name cannot be empty');
    }
  }
  removeFromMonthlyShoppingList(ingredient: any) {
    this.shoppingListService.removeFromMonthlyList(ingredient);
  }

}
