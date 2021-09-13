import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BotaoMenu } from 'src/app/interfaces/botao-menu';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { BotaoMenuService } from 'src/app/services/botao-menu.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public usuario: Usuario = null;
  public usuarioId: string = null;
  private usuarioSubscription: Subscription;

  public botoesMenu = new Array<BotaoMenu>();
  private botoesMenuSubscription: Subscription;

  constructor(private authService: AuthService,
    private alertCtrl: AlertController,
    private botaoMenuService: BotaoMenuService) {
    this.carregarDados();
  }

  public async carregarDados() {
    this.usuarioId = (await this.authService.getAuth().currentUser).uid;
    this.usuarioSubscription = this.authService.getUsuario(this.usuarioId).subscribe(data => {
      this.usuario = data;
    });
    this.botoesMenuSubscription = this.botaoMenuService.getBotoesMenu().subscribe(data => {
      this.botoesMenu = data;
    })
  }

  ngOnDestroy() {
    this.usuarioSubscription.unsubscribe();
    this.botoesMenuSubscription.unsubscribe();
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
