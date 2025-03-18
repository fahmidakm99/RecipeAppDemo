import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySpacePageRoutingModule } from './my-space-routing.module';

import { MySpacePage } from './my-space.page';
import { FilterModalComponent } from './filter-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MySpacePageRoutingModule
  ],
  declarations: [MySpacePage, FilterModalComponent]
})
export class MySpacePageModule {}
