import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { Dia } from 'src/app/interfaces/dia';
import { DiaUnidade } from 'src/app/interfaces/dia-unidade';
import { PorcentagemCovid } from 'src/app/interfaces/porcentagem-covid';
import { Unidades } from 'src/app/interfaces/unidades';
import { AuthService } from 'src/app/services/auth.service';
import { DiaService } from 'src/app/services/dia.service';
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

  public usuarioId: string = null;
  private usuarioSubscription: Subscription;

  public unidades = new Array<Unidades>();
  private unidadesSubscription: Subscription;

  public porcentagemCovid = new Array<PorcentagemCovid>();
  private porcentagemSubscription: Subscription;

  public dia: Dia = {};
  public dias = new Array<Dia>();
  private diasSubscription: Subscription;

  public diaUnidade: DiaUnidade;
  public diaUnidades: DiaUnidade[];

  public focado: number;

  constructor(private unidadesService: UnidadeService,
    private porcentagemService: PorcentagemCovidService,
    private diasService: DiaService,
    private authService: AuthService,
    private afs: AngularFirestore){
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
    this.diasSubscription = this.diasService.getDias().subscribe(data => {
      this.dias = data;
      this.diaUnidade = {};
    });
    this.usuarioId = (await this.authService.getAuth().currentUser).uid;
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
    this.diasSubscription.unsubscribe();
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
    //console.log(this.escolhaDia);
    //this.afs.collection<Dia>('Dias').doc(this.escolhaDia).set({id: this.escolhaDia, unidades: [{id: this.escolha, contador: this.unidades.find(p => p.id === this.escolha).capacidadeCovid}]});
    //this.afs.collection<Dia>('Dias').doc(this.escolhaDia).update({unidades: [{id: this.escolha, contador: this.unidades.find(p => p.id === this.escolha).capacidadeCovid}]})
    this.dia = this.dias.find(d => d.id === this.escolhaDia);
    console.log(this.dia)
    this.diaUnidade.id = this.escolha;
    console.log(this.diaUnidade.id)
    this.diaUnidade.contador = this.unidades.find(u => u.id === this.escolha).capacidadeCovid;
    console.log(this.diaUnidade.contador)
    this.diaUnidades = this.dia.unidades;
    console.log(this.diaUnidades)
    this.diaUnidades.unshift(this.diaUnidade);
    console.log(this.diaUnidades)
    this.diasService.criandoUnidadeDia(this.escolhaDia, this.diaUnidades);
  }

  private agendamento(){
    for(let dia of this.dias){ //percorre os dias 
      if(dia.id === this.escolhaDia){ //verifica se o dia escolhido pelo usuario existe 
        //se true existe agendamentos nesse dia
        for(let unidade of dia.unidades){ //percorre as unidades 
          if(unidade.id === this.escolha){ //verifica se a unidade escolhida é igual a do dia
            for(let agendamento of unidade.agendamentos){
              if(agendamento.user === this.usuarioId){
                //caso 4
                //emitir erro 'você ja agendou nesse dia'
              }else{
                //caso 3
                //permitir o agendamento
              }
            }
          }else{
            //caso 2
            //a unidade ainda não existe
            //this.afs.collection<Dia>('Dias').doc(this.escolha).update({unidades: [{id: this.escolha, contador: this.unidades.find(p => p.id === this.escolha).capacidadeCovid}]})
            this.diasSubscription = this.diasService.getDia(this.escolhaDia).subscribe(data => {
              this.dia = data;
            });
            this.diaUnidade.id = this.escolha;
            this.diaUnidade.contador = this.unidades.find(u => u.id === this.escolha).capacidadeCovid;
            this.diaUnidades = this.dia.unidades;
            this.diaUnidades.unshift(this.diaUnidade);
            this.diasService.criandoUnidadeDia(this.escolhaDia, this.diaUnidades);
          }
        }
      }else{
        //caso 1
        //criar documento do dia esfecifico
        //permitir o agendamento
        //this.afs.collection<Dia>('Dias').doc(this.escolhaDia).set({id: this.escolhaDia, unidades: [{id: this.escolha, contador: this.unidades.find(p => p.id === this.escolha).capacidadeCovid}]})
        this.diaUnidade.id = this.escolha;
        this.diaUnidade.contador = this.unidades.find(u => u.id === this.escolha).capacidadeCovid;
        this.diasService.criarDocDia(this.escolha, this.diaUnidade);
      }
    }
  }

}

