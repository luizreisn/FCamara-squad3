import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PorcentagemCovid } from 'src/app/interfaces/porcentagem-covid';
import { Unidades } from 'src/app/interfaces/unidades';
import { PorcentagemCovidService } from 'src/app/services/porcentagem-covid.service';
import { UnidadeService } from 'src/app/services/unidade.service';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.page.html',
  styleUrls: ['./agendamento.page.scss'],
})
export class AgendamentoPage{

  public escolha: string;
  public escolhaDia: string;
  public diaMin: string;
  public diaMax: string;
  public customDaysName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  public unidades = new Array<Unidades>();
  private unidadesSubscription: Subscription;

  public porcentagemCovid = new Array<PorcentagemCovid>();
  private porcentagemSubscription: Subscription;

  public focado: number;

  constructor(private unidadesService: UnidadeService,
    private porcentagemService: PorcentagemCovidService){
    this.carregarDados();
    this.diaMin= new Date(Date.now()).toISOString();
    this.diaMax = new Date(Date.now() + ( 3600 * 1000 * 24* 7)).toISOString();
  }

  public async carregarDados(){
    this.unidadesSubscription = this.unidadesService.getUnidades().subscribe( data => {
      this.unidades = data;
      this.focado = 0;
    });
    this.porcentagemSubscription = this.porcentagemService.getPorcentagens().subscribe( data => {
      this.porcentagemCovid = data;
      this.porcentagem();
    });
  }

  public porcentagem(){
    for(let unidade of this.unidades){
      for(let porcentagem of this.porcentagemCovid){
        if(unidade.id === porcentagem.id){
          unidade.capacidadeCovid = unidade.capacidadeMax * (porcentagem.porcentagem/100)
          console.log( unidade.nome ,unidade.capacidadeCovid)
        }
      }
    }
  }

  ngOnDestroy(){
    this.unidadesSubscription.unsubscribe();
    this.porcentagemSubscription.unsubscribe();
  }

  public focar(){
    if(this.focado === 1){
      this.focado = 0;
    }else{
      this.focado = 1;
    }
    console.log(this.focado )
  }

  public formatar(){
    this.escolhaDia = this.escolhaDia.split('T')[0];
    console.log(this.escolhaDia);
  }



}
