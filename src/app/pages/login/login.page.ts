import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  @ViewChild(IonSlides) slides: IonSlides;

  public usuarioLogin: Usuario = {};
  public usuarioCadastro: Usuario = {};
  private loading: any;

  constructor(private authService: AuthService,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  public segmentChanged(event: any) {
    if (event.detail.value == 'login') {
      this.slides.slidePrev();
    } else if (event.detail.value == 'cadastro') {
      this.slides.slideNext();
    }
  }

  public async login() {
    await this.carregando();
    try {
      await this.authService.login(this.usuarioLogin);
    } catch (error) {
      let message: string;
      switch (error.code) {
        case 'auth/argument-error':
          message = 'O campo E-Mail e Senha devem ser preenchidos corretamente!'
          break;
        case 'auth/user-not-found':
          message = 'Usuário não encontrado, ainda não foi cadastrado ou foi excluido!'
          break;
        case 'auth/invalid-email':
          message = 'E-Mail inválido!'
          break;
        case 'auth/wrong-password':
          message = 'Senha incorreta';
          break;
        case 'auth/missing-email':
          message = 'Insira um E-Mail';
          break;
        case 'auth/internal-error':
          message = 'Insira uma senha';
          break;
      }
      console.log(error);
      this.toastErro(message);
    } finally {
      this.loading.dismiss();
    }
  }

  public async cadastrar() {
    await this.carregando();
    try {
      const novoUsuario = await this.authService.cadastrar(this.usuarioCadastro);
      this.usuarioCadastro.agendamentos = [];
      this.usuarioCadastro.id = novoUsuario.user.uid;
      await this.afs.collection<Usuario>('Usuarios').doc(novoUsuario.user.uid).set(this.usuarioCadastro);
    } catch (error) {
      let message: string;
      switch (error.code) {
        case 'auth/argument-erro':
          message = 'O campo E-Mail e Senha devem ser preenchidos corretamente!'
          break;
        case 'auth/email-already-in-use':
          message = 'E-Mail já está sendo usado'
          break;
        case 'auth/weak-password':
          message = 'A senha deve conter no mínimo 6 caracteres!'
          break;
        case 'auth/invalid-email':
          message = 'E-Mail invalido'
          break;
        case 'auth/admin-restricted-operation':
          message = 'Insira seus dados'
          break;
        case 'auth/missing-email':
          message = 'Insira um E-Mail';
          break;
        case 'auth/internal-error':
          message = 'Insira uma senha';
          break;
      }
      console.log(error);
      this.toastErro(message);
    } finally {
      this.loading.dismiss();
    }
  }

  private async carregando() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor aguarde ...' });
    return this.loading.present();
  }

  private async toastErro(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color: 'primary' });
    toast.present();
  }

}
