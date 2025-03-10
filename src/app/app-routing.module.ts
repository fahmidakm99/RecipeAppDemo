// import { NgModule } from '@angular/core';
// import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './auth.guard'; // Import the Auth Guard

// const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
//     // loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
//   },
//   { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
//   {
//     path: 'home',
//     loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
//     canActivate: [AuthGuard], // Move this outside of the loadChildren function
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
//   { path: 'monthly-shopping-list',
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
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Import the Auth Guard
import { RegisterPage } from './register/register.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redirect to login initially
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  { path: 'register', component: RegisterPage },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard], // Protect Home Page
  },
  {
    path: 'my-space',
    loadChildren: () =>
      import('./my-space/my-space.module').then((m) => m.MySpacePageModule),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./categories/categories.module').then(
        (m) => m.CategoriesPageModule
      ),
  },
  {
    path: 'category-details/:category',
    loadChildren: () =>
      import('./category-details/category-details.module').then(
        (m) => m.CategoryDetailsPageModule
      ),
  },
  {
    path: 'add-recipe',
    loadChildren: () =>
      import('./add-recipe/add-recipe.module').then(
        (m) => m.AddRecipePageModule
      ),
    canActivate: [AuthGuard], // Protect recipe-related pages
  },
  {
    path: 'all-recipes',
    loadChildren: () =>
      import('./all-recipe/all-recipes.module').then(
        (m) => m.AllRecipesPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./favorites/favorites.module').then((m) => m.FavoritesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'single-recipie-info/:id',
    loadChildren: () =>
      import('./single-recipie-info/single-recipie-info.module').then(
        (m) => m.SingleRecipieInfoPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'single-recipie-info-public/:id',
    loadChildren: () =>
      import(
        './single-recipie-info-public/single-recipie-info-public.module'
      ).then((m) => m.SingleRecipieInfoPublicPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-recipe',
    loadChildren: () =>
      import('./edit-recipe/edit-recipe.module').then(
        (m) => m.EditRecipePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'shoppingList',
    loadChildren: () =>
      import('./shoppingList/shoppingList.module').then(
        (m) => m.ShoppingListPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'monthly-shopping-list',
    loadChildren: () =>
      import('./monthly-shopping-list/monthly-shopping-list.module').then(
        (m) => m.MonthlyShoppingListPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'weekly-shopping-list',
    loadChildren: () =>
      import('./weekly-shopping-list/weekly-shopping-list.module').then(
        (m) => m.WeeklyShoppingListPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AuthGuard], // ✅ Protect tabs from unauthorized users
  },
  {
    path: '**',
    redirectTo: '', // Redirect to login for any unknown route
    pathMatch: 'full',
  },
  {
    path: 'my-space',
    loadChildren: () =>
      import('./my-space/my-space.module').then((m) => m.MySpacePageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
