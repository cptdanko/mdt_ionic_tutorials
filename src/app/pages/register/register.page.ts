import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";

  validation_messages = {
    'email':[
      {type:"required", message: "Email is required"},
      {type:"pattern", message: "Please enter a valid email"},
    ],
    'password': [
      {type:"required", message: "Password is required"},
      {type:"minLength", message: "Password must be at least 6 characters"},
    ]
  };

  constructor(private authService: AuthService, 
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      name: new FormControl('')
    })
  }
  tryRegister(value) {
    this.authService.registerUser(value).then(
      res => {
        let alertOptions = {
          header: "Account created",
          message: "For email: "+value.email,
          buttons: ['ok']
        }
        this.showAlert(alertOptions);
        this.authService.login(value).then(() => {
          this.router.navigate(["/note"]);
        }).catch(() => {
          let alertOptions = {
            header: "Can't login",
            message: "Error logging you in",
            buttons: ['ok']
          };
          this.showAlert(alertOptions);
        });
      }, err => {
        let alertOptions = {
          header: "Cannot register",
          message: err.message,
          buttons: ['ok']
        };
        this.showAlert(alertOptions);
      }
    )
  }
  async showAlert(options){
    let alertDialog = await this.alertCtrl.create(options);
    return await alertDialog.present();
  }
}
