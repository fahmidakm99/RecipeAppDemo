import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'favorites',
        loadChildren: () => import('../favorites/favorites.module').then(m => m.FavoritesPageModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule)
      },
      {
        path: 'shoppingList',
        loadChildren: () => import('../shoppingList/shoppingList.module').then(m => m.ShoppingListPageModule)
      },
      {
        path: 'all-recipes',
        loadChildren: () => import('../all-recipe/all-recipes.module').then(m => m.AllRecipesPageModule)
      },
      {
        path: 'edit-recipe',
        loadChildren: () => import('../edit-recipe/edit-recipe.module').then(m => m.EditRecipePageModule)
      },
      {
        path: 'add-recipes',
        loadChildren: () => import('../add-recipe/add-recipe.module').then(m => m.AddRecipePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
