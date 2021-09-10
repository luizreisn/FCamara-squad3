import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuarioColecao: AngularFirestoreCollection<Usuario>;

  constructor(private afa: AngularFireAuth, private afs: AngularFirestore) { 
    this.usuarioColecao = this.afs.collection<Usuario>('Usuarios');
  }

  public getAuth(){
    return this.afa;
  }

  public getUsuario(id:string){
    return this.usuarioColecao.doc<Usuario>(id).valueChanges();
  }

  public cadastrar(usuarioCadastro: Usuario){
    return this.afa.createUserWithEmailAndPassword(usuarioCadastro.email, usuarioCadastro.senha);
  }

  public login(usuarioLogin: Usuario){
    return this.afa.signInWithEmailAndPassword(usuarioLogin.email, usuarioLogin.senha);
  }

  public sair(){
    return this.afa.signOut();
  }
}
