import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { DiaService } from 'src/app/services/dia.service';

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

  constructor(private authService: AuthService,
    private diaService: DiaService) { 
    this.carregarDados()
  }

  public async carregarDados(){
    this.usuarioId = (await this.authService.getAuth().currentUser).uid
    this.usuarioSubscription = this.authService.getUsuario(this.usuarioId).subscribe(data => {
      this.usuario = data;
      this.quantidadeAgendamentos = this.usuario.agendamentos.length;
    });
  }

  public deletar(id: string){
    console.log(this.usuario.agendamentos)
    const index = this.usuario.agendamentos.findIndex(a => a.id === id)
    this.usuario.agendamentos.splice(index, 1);
    console.log(this.usuario.agendamentos)
    this.authService.atualizarDados(this.usuarioId, this.usuario);
    

  }


}
