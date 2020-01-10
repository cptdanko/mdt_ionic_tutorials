import { Component, OnInit, EventEmitter,Input, Output } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AlertController,LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthService } from  '../../services/auth.service';


@Component({
  selector: 'app-firebase-image-upload',
  templateUrl: './firebase-image-upload.component.html',
  styleUrls: ['./firebase-image-upload.component.scss'],
})
export class FirebaseImageUploadComponent implements OnInit {

  @Input() path: string; 
  @Output() outcome = new EventEmitter<any>(true);


  task: AngularFireUploadTask;
  uploadProgress: Observable<any>;
  round = Math.round;
  fileToUpload: File;
  UploadedFireURL: Observable<string>;
  filesize: number; 
  isUploading = false;

  constructor(private alertCtrl: AlertController,
              private fireStorage: AngularFireStorage) { }

  ngOnInit() {
    console.log(this.path);
  }
  
  
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  /*I am using it here, but in your production code, try to avoid
    storing and relying on class level variables. This gives
    the code state and you would have problems later on when 
    your user base grows. Then you may have scaling problems */
  upload() {
    let filename = this.fileToUpload.name;
    const fullPath = `${this.path}/${new Date().getTime()}_${filename}`;
    
    const fileref = this.fireStorage.ref(fullPath);

    const customMetadata = { app: 'Upload demo' };
    // Totally optional metadata
    this.task = this.fireStorage.upload(fullPath, this.fileToUpload, { customMetadata });
    this.isUploading = true;
    this.task.catch(res => {
      this.isUploading = false;
      console.log("Error uploading the file");
    });
    this.uploadProgress = this.task.percentageChanges();
    this.uploadProgress.subscribe( percentage => {
      console.log(percentage);
    }, err => {
      this.isUploading = false;
    });
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.UploadedFireURL = fileref.getDownloadURL();
        this.UploadedFireURL.subscribe( urlStr => {
          //created an object for sake of clarity
          const uploadOutcome = {
            hasUploaded: true,
            uploadUrl: urlStr
          };
          this.outcome.emit(uploadOutcome);
          this.isUploading = false;
          this.uploadDone();
          this.uploadProgress = null;
        });
      }),
      tap(snap => {
        this.filesize = snap.totalBytes;
      })
    ).subscribe( res => {
      console.log(res);
    })
  }
  async uploadDone() {
    const alert = await this.alertCtrl.create({
      header: "👍",
      message: "Image uploaded 😊",
      buttons: ['Ok']
    });
    await alert.present();
  }
}
