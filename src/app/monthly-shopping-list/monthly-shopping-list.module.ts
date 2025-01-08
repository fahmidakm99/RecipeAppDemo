import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonthlyShoppingListPageRoutingModule } from './monthly-shopping-list-routing.module';

import { MonthlyShoppingListPage } from './monthly-shopping-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonthlyShoppingListPageRoutingModule
  ],
  declarations: [MonthlyShoppingListPage]
})
export class MonthlyShoppingListPageModule {}
