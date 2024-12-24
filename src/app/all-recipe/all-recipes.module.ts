import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AllRecipesPages } from './all-recipes.page';
import { AllRecipesPageRoutingModule } from './all-recipes-routing.module';
import { TabsPageModule } from '../tabs/tabs.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllRecipesPageRoutingModule
    // TabsPageModule
  ],
  declarations: [AllRecipesPages]
})
export class AllRecipesPageModule {}
