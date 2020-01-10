import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.page.html',
  styleUrls: ['./image-upload.page.scss'],
})
export class ImageUploadPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  uploadFinished(outcomeObj) {
    if(outcomeObj.hasUploaded) {
      console.log("Image successfully uploaded with url...");
      console.log(outcomeObj.uploadUrl);
    }
  }
}
