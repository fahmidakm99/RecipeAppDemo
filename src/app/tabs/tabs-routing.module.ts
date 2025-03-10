// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { TabsPage } from './tabs.page';

// const routes: Routes = [
//   {
//     path: '',
//     component: TabsPage,
//     children: [
//       {
//         path: 'home',
//         loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
//       },
//       {
//         path: 'favorites',
//         loadChildren: () => import('../favorites/favorites.module').then(m => m.FavoritesPageModule),
//       },
//       {
//         path: 'categories',
//         loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule),
//       },
//       {
//         path: 'shoppingList',
//         loadChildren: () => import('../shoppingList/shoppingList.module').then(m => m.ShoppingListPageModule),
//       },
//       {
//         path: '',
//         redirectTo: 'home',
//         pathMatch: 'full',
//       },
//     ],
//   },
//   {
//     path: '',
//     redirectTo: '/tabs/home',
//     pathMatch: 'full',
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class TabsPageRoutingModule {}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'favorites',
        loadChildren: () => import('../favorites/favorites.module').then(m => m.FavoritesPageModule),
      },
      {
        path: 'categories',
        loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule),
      },
      {
        path: 'shoppingList',
        loadChildren: () => import('../shoppingList/shoppingList.module').then(m => m.ShoppingListPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/home',  // ✅ This should be the only default redirect inside tabs
        pathMatch: 'full',
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
