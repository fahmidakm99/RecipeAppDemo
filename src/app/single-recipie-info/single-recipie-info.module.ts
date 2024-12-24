import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleRecipieInfoPageRoutingModule } from './single-recipie-info-routing.module';

import { SingleRecipieInfoPage } from './single-recipie-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleRecipieInfoPageRoutingModule
  ],
  declarations: [SingleRecipieInfoPage]
})
export class SingleRecipieInfoPageModule {}
