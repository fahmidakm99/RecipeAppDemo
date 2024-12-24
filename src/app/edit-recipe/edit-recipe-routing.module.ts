import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { EditRecipePage } from './edit-recipe.page';
import { AddRecipePage } from '../add-recipe/add-recipe.page';
import { EditRecipePage } from './edit-recipe.page';

const routes: Routes = [
  {
    path: '',
    component: EditRecipePage
  }
];

// const routes: Routes = [
//   { path: 'edit-recipe/:id', component: AddRecipePage },
//   // Other routes
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRecipePageRoutingModule {}
