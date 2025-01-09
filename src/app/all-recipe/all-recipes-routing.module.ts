import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllRecipesPages } from './all-recipes.page';

const routes: Routes = [
  {
    path: '',
    component: AllRecipesPages
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllRecipesPageRoutingModule {}
