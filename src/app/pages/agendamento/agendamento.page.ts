import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
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

  public porcentagensCovid = new Array<PorcentagemCovid>();
  private porcentagensSubscription: Subscription;

  public dias = new Array<Dia>();
  private diasSubscription: Subscription;
  public diaUnidades: DiaUnidade[];
  public diaContador: number;

  public focado: number;
  public loading: any;

  constructor(private unidadesService: UnidadeService,
    private porcentagemService: PorcentagemCovidService,
    private diasService: DiaService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController) {
    this.carregarDados();
    this.diaMin = new Date(Date.now() + (3600 * 1000 * 24)).toISOString();
    this.diaMax = new Date(Date.now() + (3600 * 1000 * 24 * 7)).toISOString();
  }

  public async carregarDados() {
    this.unidadesSubscription = this.unidadesService.getUnidades().subscribe(data => {
      this.unidades = data;
      this.focado = 0;
    });
    this.porcentagensSubscription = this.porcentagemService.getPorcentagens().subscribe(data => {
      this.porcentagensCovid = data;
      this.porcentagem();
    });
    this.diasSubscription = this.diasService.getDias().subscribe(data => {
      this.dias = data;
      this.diaUnidades = [];
      this.escolhaDia = null;
      this.escolhaUnidade = null;
      this.diaContador = null;
    });
    this.usuarioId = (await this.authService.getAuth().currentUser).uid;
    this.usuarioSubscription = this.authService.getUsuario(this.usuarioId).subscribe(data => {
      this.usuario = data;
    });
  }

  public porcentagem() {
    for (let unidade of this.unidades) {
      for (let porcentagem of this.porcentagensCovid) {
        if (unidade.id === porcentagem.id) {
          unidade.capacidadeCovid = unidade.capacidadeMax * (porcentagem.porcentagem / 100)
        }
      }
    }
  }

  ngOnDestroy() {
    this.unidadesSubscription.unsubscribe();
    this.porcentagensSubscription.unsubscribe();
    this.diasSubscription.unsubscribe();
  }

  public focar() {
    if (this.focado === 1) {
      this.focado = 0;
    } else {
      this.focado = 1;
    }
  }

  private async fazerAgendamento() {
    this.escolhaDia = this.escolhaDia.split('T')[0];

    if (this.usuario.agendamentos.find(a => a.data === this.escolhaDia)) {
      await this.carregando();
      this.toast('Você já possui um agendamento neste dia, tente outro!');
      this.carregarDados();
    } else {
      if (this.dias.find(d => d.id === this.escolhaDia)) {
        if (this.dias.find(d => d.id === this.escolhaDia).unidades.find(u => u.id === this.escolhaUnidade)) {
          if (this.dias.find(d => d.id === this.escolhaDia).unidades.find(u => u.id === this.escolhaUnidade).contador != 0) {
            await this.carregando();
            this.agendamentoUsuario();
            this.diaContador = this.dias.find(d => d.id === this.escolhaDia).unidades.find(u => u.id === this.escolhaUnidade).contador;
            this.diaContador -= 1;
            this.dias.find(d => d.id === this.escolhaDia).unidades.find(u => u.id === this.escolhaUnidade).contador = this.diaContador;
            this.diasService.atualizandoUnidade(this.escolhaDia, this.dias.find(d => d.id === this.escolhaDia).unidades);
            this.toast('Agendamento realizado com sucesso!');
            this.voltarHome();
          } else {
            await this.carregando();
            this.toast('Não existem vagas disponiveis para essa unidade, tente outro dia!');
            this.carregarDados();
          }
        } else {
          await this.carregando();
          this.agendamentoUsuario();
          this.diaUnidades = this.dias.find(d => d.id === this.escolhaDia).unidades;
          this.diaUnidades.unshift({ id: this.escolhaUnidade, contador: this.unidades.find(u => u.id === this.escolhaUnidade).capacidadeCovid - 1 })
          this.diasService.criandoUnidadeDia(this.escolhaDia, this.diaUnidades);
          this.toast('Agendamento realizado com sucesso!');
          this.voltarHome();
        }
      } else {
        await this.carregando();
        this.agendamentoUsuario();
        this.diaUnidades.unshift({ id: this.escolhaUnidade, contador: this.unidades.find(u => u.id === this.escolhaUnidade).capacidadeCovid - 1 })
        this.diasService.criarDocDia(this.escolhaDia, this.diaUnidades);
        this.toast('Agendamento realizado com sucesso!');
        this.voltarHome();
      }
    }

  }

  private agendamentoUsuario() {
    this.usuario.agendamentos.unshift({ id: 'agendamento_' + this.usuarioId + '_' + Math.max(this.usuario.agendamentos.length + 1), data: this.escolhaDia, user: this.usuarioId, unidade: this.escolhaUnidade });
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

  public async aviso() {
    const alerta = await this.alertCtrl.create({
      header: 'Aviso!',
      message: 'Este agendamento é valido para o dia escolhido durante todo o horário de funcionamento da unidade, não tire a vaga de alguém se não for ficar na empresa durante esse horário.',
      buttons: [{
        text: 'Cancelar',
        handler: () => {
          this.carregarDados();
        }
      }, {
        text: 'Agendar',
        handler: () => {
          this.fazerAgendamento();
        }
      }]
    })
    await alerta.present();
  }

}

