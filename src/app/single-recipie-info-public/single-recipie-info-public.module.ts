import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleRecipieInfoPublicPageRoutingModule } from './single-recipie-info-public-routing.module';

import { SingleRecipieInfoPublicPage } from './single-recipie-info-public.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleRecipieInfoPublicPageRoutingModule
  ],
  declarations: [SingleRecipieInfoPublicPage]
})
export class SingleRecipieInfoPublicPageModule {}
