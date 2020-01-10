import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ImageUploadPage } from './image-upload.page';
import { FirebaseImageUploadComponent } from '../../components/firebase-image-upload/firebase-image-upload.component';

const routes: Routes = [
  {
    path: '',
    component: ImageUploadPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ImageUploadPage, FirebaseImageUploadComponent]
})
export class ImageUploadPageModule {}
