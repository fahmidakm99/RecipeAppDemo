import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleRecipieInfoPublicPage } from './single-recipie-info-public.page';

const routes: Routes = [
  {
    path: '',
    component: SingleRecipieInfoPublicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleRecipieInfoPublicPageRoutingModule {}
