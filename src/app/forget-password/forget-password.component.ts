import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MusicService } from './../music.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  ForgetForm: FormGroup;
  forgetData = { email: '' };
  loader: boolean = false;

  constructor(private router: Router, private _flashMessagesService: FlashMessagesService, public formBuilder: FormBuilder, public musicService: MusicService) {
    this.ForgetForm = formBuilder.group({
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
    });
  }

  ngOnInit() {
  }

  forget() {
    console.log("loginData", this.forgetData);
    this.loader = true;
    this.musicService.forget(this.forgetData).then((forgetDetail) => {
      console.log('forgetDetail', forgetDetail);
      if (forgetDetail['success'] == true) {
        this.loader = false;
        // this.forgetData.email = '';
        this._flashMessagesService.show(forgetDetail['message'], { cssClass: 'alert-success' });
      } else {
        this.loader = false;
        this._flashMessagesService.show(forgetDetail['message'], { cssClass: 'alert-danger' });
      }
    }, (err) => {
      console.log(err);
    });
  }

}
