import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Unidades } from '../interfaces/unidades';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnidadeService {

  private unidadeColecao: AngularFirestoreCollection<Unidades>;

  constructor(private afs: AngularFirestore) {
    this.unidadeColecao = this.afs.collection<Unidades>('Unidades');
  }

  public getUnidades(){
    return this.unidadeColecao.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        })
      })
    )
  }

  public getUnidade(id: string){
    return this.unidadeColecao.doc<Unidades>(id).valueChanges();
  }
}
