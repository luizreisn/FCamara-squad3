import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Agendamento } from 'src/app/interfaces/agendamento';
import { Dia } from 'src/app/interfaces/dia';
import { DiaUnidade } from 'src/app/interfaces/dia-unidade';
import { PorcentagemCovid } from 'src/app/interfaces/porcentagem-covid';
import { Unidades } from 'src/app/interfaces/unidades';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { DiaService } from 'src/app/services/dia.service';
import { PorcentagemCovidService } from 'src/app/services/porcentagem-covid.service';
import { UnidadeService } from 'src/app/services/unidade.service';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.page.html',
  styleUrls: ['./agendamento.page.scss'],
})
export class AgendamentoPage {

  public escolhaUnidade: string;
  public escolhaDia: string;

  public diaMin: string;
  public diaMax: string;

  public customDaysName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  public usuario: Usuario = {};
  public usuarioId: string = null;
  public usuarioSubscription: Subscription;

  public unidades = new Array<Unidades>();
  private unidadesSubscription: Subscription;

  public porcentagemCovid = new Array<PorcentagemCovid>();
  private porcentagemSubscription: Subscription;

  public dias = new Array<Dia>();
  private diasSubscription: Subscription;

  public dia: Dia;
  public diaUnidade: DiaUnidade;
  public diaUnidades: DiaUnidade[];
  public diaAgendamentos: Agendamento[];
  public agendamento: Agendamento;

  public focado: number;
  public loading: any;

  constructor(private unidadesService: UnidadeService,
    private porcentagemService: PorcentagemCovidService,
    private diasService: DiaService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController) {
    this.carregarDados();
    this.diaMin = new Date(Date.now()).toISOString();
    this.diaMax = new Date(Date.now() + (3600 * 1000 * 24 * 7)).toISOString();
  }

  public async carregarDados() {
    this.unidadesSubscription = this.unidadesService.getUnidades().subscribe(data => {
      this.unidades = data;
      this.focado = 0;
    });
    this.porcentagemSubscription = this.porcentagemService.getPorcentagens().subscribe(data => {
      this.porcentagemCovid = data;
      this.porcentagem();
    });
    this.diasSubscription = this.diasService.getDias().subscribe(data => {
      this.dias = data;
      this.diaUnidade = {};
      this.dia = {};
      this.diaUnidades = [];
      this.diaAgendamentos = [];
      this.agendamento = {};
      this.escolhaDia = null;
      this.escolhaUnidade = null;
    });
    this.usuarioId = (await this.authService.getAuth().currentUser).uid;
    this.usuarioSubscription = this.authService.getUsuario(this.usuarioId).subscribe(data => {
      this.usuario = data;
    });
  }

  public porcentagem() {
    for (let unidade of this.unidades) {
      for (let porcentagem of this.porcentagemCovid) {
        if (unidade.id === porcentagem.id) {
          unidade.capacidadeCovid = unidade.capacidadeMax * (porcentagem.porcentagem / 100)
        }
      }
    }
  }

  ngOnDestroy() {
    this.unidadesSubscription.unsubscribe();
    this.porcentagemSubscription.unsubscribe();
    this.diasSubscription.unsubscribe();
  }

  public focar() {
    if (this.focado === 1) {
      this.focado = 0;
    } else {
      this.focado = 1;
    }
  }

  public async fazerAgendamento() {
    this.escolhaDia = this.escolhaDia.split('T')[0];

    if (this.usuario.agendamentos.find(a => a.data === this.escolhaDia)) { //verifica se o usuario já possui um agendamento neste dia
      //se retornar true o usuário já realizou um agendamento nesse dia
      //Caso 1 usuário já possui um agendamento nesse dia 
      //emitir erro
      await this.carregando();
      this.toast('Você já possui um agendamento neste dia, tente outro!');
      this.carregarDados();
    } else {
      if (this.dia = this.dias.find(d => d.id === this.escolhaDia)) { //verifica se nos dias existe um documento com a data escolhida
        //se retornar true o dia escolhido possui um documento
        if (this.diaUnidade = this.dia.unidades.find(u => u.id === this.escolhaUnidade)) { //verifica se a unidade escolhida existe no documento do dia
          //se retornar true a unidade escolhida já existe no documento do dia escolhido
          if (this.diaUnidade.contador != 0) { //verifica se o contador da unidade é diferente de zero
            //se retornar true ainda tem vaga para aquele dia
            //Caso 5 agendamento
            //permitir agendamento
            await this.carregando();
            this.agendamentoUsuario();
            this.diaUnidades = this.dias.find(d => d.id === this.escolhaDia).unidades;
            this.diaUnidade = this.diaUnidades.find(u => u.id === this.escolhaUnidade);
            console.log(this.diaUnidade.contador)
            this.diaUnidade.contador -= 1;
            console.log(this.diaUnidade.contador)
            this.diaUnidades.find(u => u.id === this.escolhaUnidade).contador = this.diaUnidade.contador;
            this.diasService.atualizandoUnidade(this.escolhaDia, this.diaUnidades);
            this.toast('Agendamento realizado com sucesso!');
            this.voltarHome();
          } else {
            //se retornar false nao possui mais vagas para aquele dia
            //Caso 4 não há vagas disponiveis para agendamento naquele dia e naquela unidade
            //emitir erro
            await this.carregando();
            this.toast('Não existem vagas disponiveis para essa unidade, tente outro dia!');
            this.carregarDados();
          }
        } else {
          //se retornar falso cria a unidade escolhida no documento do dia escolhido
          //Caso 3 unidade ainda não existe no documento do dia
          //permite agendamento
          //this.afs.collection<Dia>('Dias').doc(this.escolha).update({unidades: [{id: this.escolha, contador: this.unidades.find(p => p.id === this.escolha).capacidadeCovid}]})
          //this.acharUnidades();
          await this.carregando();
          this.agendamentoUsuario();
          this.diaUnidades = this.dias.find(d => d.id === this.escolhaDia).unidades;
          this.diaUnidades.unshift({ id: this.escolhaUnidade, contador: this.unidades.find(u => u.id === this.escolhaUnidade).capacidadeCovid - 1 })
          this.diasService.criandoUnidadeDia(this.escolhaDia, this.diaUnidades);
          this.toast('Agendamento realizado com sucesso!');
          this.voltarHome();
        }
      } else {
        //se retornar falso cria um documento com o dia escolhido e a unidade escolhida
        //Caso 2 documento do dia ainda não existe
        //permitir agendamento
        //this.afs.collection<Dia>('Dias').doc(this.escolhaDia).set({id: this.escolhaDia, unidades: [{id: this.escolha, contador: this.unidades.find(p => p.id === this.escolha).capacidadeCovid}]})
        await this.carregando();
        this.agendamentoUsuario();
        this.diaUnidade.id = this.escolhaUnidade;
        this.diaUnidade.contador = this.unidades.find(u => u.id === this.escolhaUnidade).capacidadeCovid - 1;
        this.diasService.criarDocDia(this.escolhaDia, this.diaUnidade);
        this.toast('Agendamento realizado com sucesso!');
        this.voltarHome();
      }
    }

  }

  private agendamentoUsuario() {
    this.agendamento = { id: 'agendamento_' + this.usuarioId + '_' + Math.max(this.usuario.agendamentos.length + 1), data: this.escolhaDia, user: this.usuarioId, unidade: this.escolhaUnidade, status: true };
    this.usuario.agendamentos.unshift(this.agendamento);
    this.authService.atualizarAgendamento(this.usuarioId, this.usuario);
  }

  private voltarHome() {
    this.navCtrl.navigateBack('/home');
  }

  private async carregando() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor aguarde ...' });
    return this.loading.present();
  }

  private async toast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, color: 'primary' });
    toast.present();
    this.loading.dismiss();
  }

}

