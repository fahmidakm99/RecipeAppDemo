import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesPage } from './categories.page';

import { CategoriesPageRoutingModule } from './categories-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CategoriesPageRoutingModule
  ],
  declarations: [CategoriesPage]
})
export class CategoriesPageModule {}
