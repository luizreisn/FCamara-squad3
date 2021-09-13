import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-meus-agendamentos',
  templateUrl: './meus-agendamentos.page.html',
  styleUrls: ['./meus-agendamentos.page.scss'],
})
export class MeusAgendamentosPage implements OnInit {

  public usuario: Usuario = {};

  constructor() { }

  ngOnInit() {
  }

}
