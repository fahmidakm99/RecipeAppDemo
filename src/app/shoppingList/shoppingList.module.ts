import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingListPage } from './shoppingList.page';

import { ShoppingListPageRoutingModule } from './shoppingList-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ShoppingListPageRoutingModule
  ],
  declarations: [ShoppingListPage]
})
export class ShoppingListPageModule {}
