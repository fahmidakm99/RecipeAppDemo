import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesPageModule),
  },
  {
    path: 'category-details',
    loadChildren: () => import('./category-details/category-details.module').then( m => m.CategoryDetailsPageModule)
  },
  {
    path: 'category-details/:category', // Updated to include a dynamic parameter
    loadChildren: () => import('./category-details/category-details.module').then(m => m.CategoryDetailsPageModule),
  },
  {
    path: 'add-recipe',
    loadChildren: () => import('./add-recipe/add-recipe.module').then( m => m.AddRecipePageModule)
  },
  {
    path: 'all-recipes',
    loadChildren: () => import('./all-recipe/all-recipes.module').then( m => m.AllRecipesPageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'single-recipie-info',
    loadChildren: () => import('./single-recipie-info/single-recipie-info.module').then( m => m.SingleRecipieInfoPageModule)
  },
  {
    path: 'single-recipie-info/:id', // Accepts the recipe ID as a parameter
    loadChildren: () => import('./single-recipie-info/single-recipie-info.module').then(m => m.SingleRecipieInfoPageModule)
  },
  {
    path: 'edit-recipe',
    loadChildren: () => import('./edit-recipe/edit-recipe.module').then( m => m.EditRecipePageModule)
  },
  {
    path: 'shoppingList',
    loadChildren: () => import('./shoppingList/shoppingList.module').then( m => m.ShoppingListPageModule)
  },
  { path: 'monthly-shopping-list', 
    loadChildren: () => import('./monthly-shopping-list/monthly-shopping-list.module').then( m => m.MonthlyShoppingListPageModule)
  },
  {  path: 'weekly-shopping-list', 
    loadChildren: () => import('./weekly-shopping-list/weekly-shopping-list.module').then( m => m.WeeklyShoppingListPageModule)
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },

 

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}


// import { NgModule } from '@angular/core';
// import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { AddRecipePage } from './add-recipe/add-recipe.page';

// const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
//   },
//   {
//     path: 'home',
//     loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
//   },
//   {
//     path: 'categories',
//     loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesPageModule),
//   },
//   {
//     path: 'category-details',
//     loadChildren: () => import('./category-details/category-details.module').then( m => m.CategoryDetailsPageModule)
//   },
//   {
//     path: 'category-details/:category', // Updated to include a dynamic parameter
//     loadChildren: () => import('./category-details/category-details.module').then(m => m.CategoryDetailsPageModule),
//   },
//   {
//     path: 'add-recipe',
//     loadChildren: () => import('./add-recipe/add-recipe.module').then( m => m.AddRecipePageModule)
//   },
//   {
//     path: 'all-recipes',
//     loadChildren: () => import('./all-recipe/all-recipes.module').then( m => m.AllRecipesPageModule)
//   },
//   {
//     path: 'favorites',
//     loadChildren: () => import('./favorites/favorites.module').then( m => m.FavoritesPageModule)
//   },
//   {
//     path: 'single-recipie-info',
//     loadChildren: () => import('./single-recipie-info/single-recipie-info.module').then( m => m.SingleRecipieInfoPageModule)
//   },
//   {
//     path: 'single-recipie-info/:id', // Accepts the recipe ID as a parameter
//     loadChildren: () => import('./single-recipie-info/single-recipie-info.module').then(m => m.SingleRecipieInfoPageModule)
//   },
//   {
//     path: 'edit-recipe',
//     loadChildren: () => import('./edit-recipe/edit-recipe.module').then( m => m.EditRecipePageModule)
//   },
//   {
//     path: 'shoppingList',
//     loadChildren: () => import('./shoppingList/shoppingList.module').then( m => m.ShoppingListPageModule)
//   },
//     { path: 'monthly-shopping-list', 
//     loadChildren: () => import('./monthly-shopping-list/monthly-shopping-list.module').then( m => m.MonthlyShoppingListPageModule)
//   },
//   {  path: 'weekly-shopping-list', 
//     loadChildren: () => import('./weekly-shopping-list/weekly-shopping-list.module').then( m => m.WeeklyShoppingListPageModule)
//   },
 
//   {
//     path: '**',
//     redirectTo: '',
//     pathMatch: 'full',
//   },

 

// ];
// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
//   ],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}
