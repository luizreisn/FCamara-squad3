import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusAgendamentosPageRoutingModule } from './meus-agendamentos-routing.module';

import { MeusAgendamentosPage } from './meus-agendamentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeusAgendamentosPageRoutingModule
  ],
  declarations: [MeusAgendamentosPage]
})
export class MeusAgendamentosPageModule {}
