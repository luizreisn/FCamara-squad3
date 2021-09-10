import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private authService: AuthService,
    private alertCtrl: AlertController) {}

  public async sair(){
    const alertSair = await this.alertCtrl.create({
      header: 'Deseja mesmo sair?',
      buttons: [{
        text: 'Cancelar'
      },{
        text: 'Sair',
        handler: () => {
          this.authService.sair();
        }
      }]
    })
    await alertSair.present();
  }

}
