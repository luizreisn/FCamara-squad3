import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-meus-agendamentos',
  templateUrl: './meus-agendamentos.page.html',
  styleUrls: ['./meus-agendamentos.page.scss'],
})
export class MeusAgendamentosPage {

  public quantidadeAgendamentos: number;

  public usuario: Usuario = {};
  public usuarioId: string = null;
  private usuarioSubscription: Subscription;

  constructor(private authService: AuthService,) { 
    this.carregarDados()
  }

  public async carregarDados(){
    this.usuarioId = (await this.authService.getAuth().currentUser).uid;
    this.usuarioSubscription = this.authService.getUsuario(this.usuarioId).subscribe(data => {
      this.usuario = data;
      this.quantidadeAgendamentos = this.usuario.agendamentos.length;
    });
  }



}
