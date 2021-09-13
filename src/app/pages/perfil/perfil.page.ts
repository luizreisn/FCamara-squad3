import { Component } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {

  public usuario: Usuario = {};
  public usuarioId: string = null;
  public usuarioSubscription: Subscription;

  private loading: any;

  constructor(private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
    this.carregarDados();
  }

  public async carregarDados() {
    this.usuarioId = (await this.authService.getAuth().currentUser).uid;
    this.usuarioSubscription = this.authService.getUsuario(this.usuarioId).subscribe(data => {
      this.usuario = data;
    })
  }

  ngOnDestroy() {
    this.usuarioSubscription.unsubscribe();
  }

  private async atualizarDados() {
    await this.carregando();
    try {
      this.authService.atualizarDados(this.usuarioId, this.usuario);
      this.toast('Dados atualizados com sucesso!');
    } catch (error) {
      this.toast('Erro ao atualizar usuário!');
    } finally {
      this.loading.dismiss();
    }
  }

  private async carregando() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor aguarde ...' });
    return this.loading.present();
  }

  private async toast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color: 'primary' });
    toast.present();
  }

  public async atualizar() {
    const alertaAtualizar = await this.alertCtrl.create({
      header: 'Deseja mesmo atualizar os seus dados?',
      message: 'Os dados antigos serão perdidos permanentemente!',
      buttons: [{
        text: 'Cancelar',
        handler: () => {
          this.carregarDados();
        }
      }, {
        text: 'Atualizar',
        handler: () => {
          this.atualizarDados();
        }
      }]
    })
    await alertaAtualizar.present();
  }



}
