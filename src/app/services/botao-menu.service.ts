import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { BotaoMenu } from '../interfaces/botao-menu';

@Injectable({
  providedIn: 'root'
})
export class BotaoMenuService {

  private botoesMenuColacao: AngularFirestoreCollection<BotaoMenu>;

  constructor(private afs: AngularFirestore) {
    this.botoesMenuColacao = this.afs.collection<BotaoMenu>('BotaoMenu');
  }

  public getBotoesMenu() {
    return this.botoesMenuColacao.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

}
