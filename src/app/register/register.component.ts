import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MusicService } from './../music.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  RegisterForm: FormGroup;
  registerData = { name: '', email: '', password: '', };
  loader: boolean = false;
  constructor(private router: Router,private _flashMessagesService: FlashMessagesService, public formBuilder: FormBuilder, public musicService: MusicService) {
    this.RegisterForm = formBuilder.group({
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])],
      name: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {   
  }

  register() {
    console.log("this.registerData", this.registerData);
    this.loader = true;
    this.musicService.register(this.registerData).then((registrationDetail) => {
      console.log("registrationDetail", registrationDetail);
      if (registrationDetail['success'] == true) {
        // this.registerData.name = '';
        // this.registerData.email = '';
        // this.registerData.password = '';
        this._flashMessagesService.show(registrationDetail['message'], { cssClass: 'alert-success' });
        this.loader = false;
      } else {
        this._flashMessagesService.show(registrationDetail['message'], { cssClass: 'alert-danger' });
        this.loader = false;
      }
    }, (err) => {
      console.log(err);
    });


  }

}
