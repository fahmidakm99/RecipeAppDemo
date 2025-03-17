import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeeklyShoppingListPage } from './weekly-shopping-list.page';

const routes: Routes = [
  {
    path: '',
    component: WeeklyShoppingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeeklyShoppingListPageRoutingModule {}
