import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeeklyShoppingListPageRoutingModule } from './weekly-shopping-list-routing.module';

import { WeeklyShoppingListPage } from './weekly-shopping-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeeklyShoppingListPageRoutingModule
  ],
  declarations: [WeeklyShoppingListPage]
})
export class WeeklyShoppingListPageModule {}
