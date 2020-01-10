import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotesService } from './notes.service';

export interface User {
  id?: string,
  name: string,
  email: string
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private userCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>
  
  constructor(private db: AngularFirestore,
    private afAuth: AngularFireAuth) { 
    this.userCollection = db.collection<User> ('users');
    this.users = this.userCollection.snapshotChanges().pipe(
      map (actions => {
        return actions.map (a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ... data};
        })
      })
    )
  }
  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password).then(
        res => {
          console.log("User id after reigstration = "+res.user.uid);
          let user: User = {
            email: value.email,
            id: res.user.uid,
            name: value.name
          };
          this.userCollection.doc(res.user.uid).set(user);
          resolve(res);
        }, err => {
          reject(err);
        }
      )
    })
  }
  login(value) {
    return firebase.auth().signInWithEmailAndPassword(value.email, value.password);
  }
  logout() {
    firebase.auth().signOut();
  }
  getCurrentUser() {
    if(firebase.auth().currentUser) {
      return firebase.auth().currentUser;
    } else {
      return null;
    }
  }
}
