import { Component, OnInit } from '@angular/core';
import { Note, NotesService } from '../../services/notes.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {

  note:Note = {
    title: "",
    addedAt: new Date().getTime(),
    text: ""
  };

  constructor(private notesService: NotesService,
            private loadingCtrl: LoadingController,
            private alertCtrl: AlertController,
            private authService: AuthService,
            private router: Router) {
    if(this.authService.getCurrentUser() == null) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
  }
  async saveNote() {
    const loading = await this.loadingCtrl.create({
      message: "saving your note",
      spinner: 'crescent',
    });
    loading.present();
    if(this.note.id == null) {
      //save the new note
      this.note.addedAt = new Date().getTime();
      this.notesService.addNote(this.note).then((noteDoc) => {
        // this returns the new note document created in the FirebaseDB
        this.note.id = noteDoc.id;
        loading.dismiss();
      });
    } else {
      this.notesService.updateNote(this.note);
      loading.dismiss();
    }
  }
}
