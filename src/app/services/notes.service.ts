import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { not } from '@angular/compiler/src/output/output_ast';
import { AuthService } from '../services/auth.service';

export interface Note {
  id?: string,
  title: string,
  text: string,
  addedAt: number,
};

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private notesCollection: AngularFirestoreCollection<Note>;
  private notes: Observable<Note[]>;

  constructor(private db: AngularFirestore,
              private afAuth: AngularFireAuth,
              private authService: AuthService) {
    let currentUser = this.authService.getCurrentUser();
    if(this.afAuth.auth.currentUser) {
      let user = this.afAuth.auth.currentUser.uid;
    }
    
    if (currentUser) {
      this.refreshNotesCollection(currentUser.uid)
    }
  }
  refreshNotesCollection(userId) {
    this.notesCollection = this.db.collection('users').doc(userId).collection<Note>('notes');
      this.notes = this.notesCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ... data};
        }))
      )
  }
  
  getNotes() {
    return this.notes;
  }
  updateNote(note) {
    return this.notesCollection.doc(note.id).update(note);
  }
  deleteNote(note) {
    this.notesCollection.doc(note.id).delete();
  }
  addNote(note) {
    return this.notesCollection.add(note);
  }
  
}
