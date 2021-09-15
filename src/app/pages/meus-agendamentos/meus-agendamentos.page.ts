import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dia } from 'src/app/interfaces/dia';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { DiaService } from 'src/app/services/dia.service';

@Component({
  selector: 'app-meus-agendamentos',
  templateUrl: './meus-agendamentos.page.html',
  styleUrls: ['./meus-agendamentos.page.scss'],
})
export class MeusAgendamentosPage {

  public usuario: Usuario = {};
  public usuarioId: string = null;
  public usuarioSubscription: Subscription;

  public quantidadeAgendamentos: number;
  public diaHoje: string;

  public diaContador: number;
  public dias = new Array<Dia>();
  public diasSubscription: Subscription;

  constructor(private authService: AuthService,
    private diaService: DiaService) {
    this.carregarDados();
    this.diaHoje = new Date(Date.now()).toISOString();
    this.diaHoje = this.diaHoje.split('T')[0];
  }

  public async carregarDados() {
    this.usuarioId = (await this.authService.getAuth().currentUser).uid;
    this.usuarioSubscription = this.authService.getUsuario(this.usuarioId).subscribe(data => {
      this.usuario = data;
    });
    this.diasSubscription = this.diaService.getDias().subscribe(data => {
      this.dias = data;
      this.diaContador = null;
      this.quantidadeAgendamentos = this.usuario.agendamentos.length;
    });
  }

  public deletar(id: string, dia: string, unidade: string) {
    const index = this.usuario.agendamentos.findIndex(a => a.id === id)
    this.usuario.agendamentos.splice(index, 1);
    this.authService.atualizarDados(this.usuarioId, this.usuario);

    this.diaContador = this.dias.find(d => d.id === dia).unidades.find(u => u.id === unidade).contador;
    this.diaContador += 1;
    this.dias.find(d => d.id === dia).unidades.find(u => u.id === unidade).contador = this.diaContador
    console.log(this.dias.find(d => d.id === dia).unidades.find(u => u.id === unidade));
    this.diaService.atualizandoUnidade(dia, this.dias.find(d => d.id === dia).unidades);

    this.carregarDados();
  }


}
