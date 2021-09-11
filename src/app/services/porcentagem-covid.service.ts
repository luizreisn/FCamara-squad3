import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { PorcentagemCovid } from '../interfaces/porcentagem-covid';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PorcentagemCovidService {

  private porcentagemColecao: AngularFirestoreCollection<PorcentagemCovid>;

  constructor(private afs: AngularFirestore) { 
    this.porcentagemColecao = this.afs.collection<PorcentagemCovid>('PorcentagemCovid');
  }

  public getPorcentagens(){
    return this.porcentagemColecao.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        })
      })
    )
  }

  public getProduto(id: string){
    return this.porcentagemColecao.doc<PorcentagemCovid>(id).valueChanges();
  }
}
