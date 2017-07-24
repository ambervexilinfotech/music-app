import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MusicService } from './../music.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  LoginForm: FormGroup;
  loginData = { email: '', password: '', };
  loader: boolean = false;
  user: any;
  headers: any;
  options: any;
  constructor(private router: Router, private _flashMessagesService: FlashMessagesService, public formBuilder: FormBuilder, public musicService: MusicService) {
    this.LoginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])],
    });
  }

  ngOnInit() {    
  }

  login() {
    console.log("loginData", this.loginData);
    this.loader = true;
    this.musicService.login(this.loginData).then((userDetail) => {
      console.log('userDetail', userDetail);
      console.log('userDetail.success', userDetail['success']);
      console.log('userDetail.message', userDetail['message']);

      if (userDetail['success'] == true) {
        this.user = userDetail['user'];
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('x-access-token', userDetail['token']);
        this.options = new RequestOptions({ headers: this.headers });
        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("header", JSON.stringify(this.options));
        this.loader = false;
        this.router.navigate(['/category']);

      } else {
        this.loader = false;
        this._flashMessagesService.show(userDetail['message'], { cssClass: 'alert-danger' });
      }
    }, (err) => {
      console.log(err);
    });
  }

}
