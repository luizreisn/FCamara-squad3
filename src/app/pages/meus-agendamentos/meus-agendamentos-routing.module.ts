import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusAgendamentosPage } from './meus-agendamentos.page';

const routes: Routes = [
  {
    path: '',
    component: MeusAgendamentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusAgendamentosPageRoutingModule {}
