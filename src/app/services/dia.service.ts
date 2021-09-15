import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { find, map } from 'rxjs/operators';
import { Agendamento } from '../interfaces/agendamento';
import { Dia } from '../interfaces/dia';
import { DiaUnidade } from '../interfaces/dia-unidade';
import { Unidades } from '../interfaces/unidades';

@Injectable({
  providedIn: 'root'
})
export class DiaService {

  public diaColecao: AngularFirestoreCollection<Dia>;

  constructor(private afs: AngularFirestore) {
    this.diaColecao = this.afs.collection<Dia>('Dias');
  }

  public getDias() {
    return this.diaColecao.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  public getDia(id: string) {
    return this.diaColecao.doc<Dia>(id).valueChanges();
  }

  public criarDocDia(id: string, dia: DiaUnidade){
    return this.diaColecao.doc<Dia>(id).set({id: id, unidades: [dia]});
  }

  public criandoUnidadeDia(id: string, unidade: DiaUnidade[]){
    return this.diaColecao.doc<Dia>(id).update({unidades: unidade});
  }

  public atualizandoUnidade(id: string, unidade: Unidades[]){
    return this.diaColecao.doc<Dia>(id).update({unidades: unidade})
  }

  public atualizarAgendamentos(id: string, unidades: DiaUnidade[]){
    return this.diaColecao.doc<Dia>(id).update({unidades: unidades })
  }

}
