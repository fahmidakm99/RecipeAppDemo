import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySpacePage } from './my-space.page';

const routes: Routes = [
  {
    path: '',
    component: MySpacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySpacePageRoutingModule {}
