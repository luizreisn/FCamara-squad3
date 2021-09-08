import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FontePageRoutingModule } from './fonte-routing.module';

import { FontePage } from './fonte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontePageRoutingModule
  ],
  declarations: [FontePage]
})
export class FontePageModule {}
