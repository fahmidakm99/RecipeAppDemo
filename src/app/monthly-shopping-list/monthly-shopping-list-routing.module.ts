import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonthlyShoppingListPage } from './monthly-shopping-list.page';

const routes: Routes = [
  {
    path: '',
    component: MonthlyShoppingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlyShoppingListPageRoutingModule {}
