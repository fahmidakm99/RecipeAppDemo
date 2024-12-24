import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleRecipieInfoPage } from './single-recipie-info.page';

const routes: Routes = [
  {
    path: '',
    component: SingleRecipieInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleRecipieInfoPageRoutingModule {}
