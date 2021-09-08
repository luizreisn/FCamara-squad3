import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FontePage } from './fonte.page';

const routes: Routes = [
  {
    path: '',
    component: FontePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FontePageRoutingModule {}
