import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public usuario: Usuario = null;
  public usuarioId: string = null;
  private usuarioSubscription: Subscription;

  constructor(private authService: AuthService,
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

  public async sair() {
    const alertSair = await this.alertCtrl.create({
      header: 'Deseja mesmo sair?',
      buttons: [{
        text: 'Cancelar'
      }, {
        text: 'Sair',
        handler: () => {
          this.authService.sair();
        }
      }]
    })
    await alertSair.present();
  }

}
