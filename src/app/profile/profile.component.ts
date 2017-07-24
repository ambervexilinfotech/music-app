import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MusicService } from './../music.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  baseurl = "../..";
  // baseurl="http://43.240.66.86/src";
  
  user: any;
  header: any;
  userData = { name: '', phone: null, email: '' };
  loader: boolean = false;
  UserForm: FormGroup;
  allUser: any;
  public uploader: FileUploader;
  // public uploader: FileUploader = new FileUploader({ url: 'http://localhost:3000/api/uploadUserImage/' + this.userData.email });
  constructor(private router: Router, private _flashMessagesService: FlashMessagesService, public formBuilder: FormBuilder, public musicService: MusicService) {
    this.UserForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.pattern('^[7-9][0-9]{9}$')])],
      photo: ['', Validators.compose([])],
      email: [{ value: '', disabled: true }, Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
    });
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("user")) !== null && JSON.parse(localStorage.getItem("header")) !== null && typeof (JSON.parse(localStorage.getItem("user"))) !== "undefined" && typeof (JSON.parse(localStorage.getItem("header"))) !== "undefined") {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.header = JSON.parse(localStorage.getItem("header"));
      this.userData.name = this.user.name;
      this.userData.phone = this.user.phone;
      this.userData.email = this.user.email;
      console.log("this.user", this.user);
      console.log("this.header", this.header);
      if (JSON.parse(localStorage.getItem("user")).type == 2) {
        this.getAllUser(JSON.parse(localStorage.getItem("user")).email);
      }
      this.uploader = new FileUploader({ url: 'http://localhost:3000/api/uploadUserImage/' + this.userData.email });
    } else {
      this.router.navigate(['/category']);
    }
  }

  deactivate(email, i) {
    console.log("email", email);
    this.musicService.deactivate(this.header, email).then((users) => {
      console.log('users', users);
      if (users['success'] == true) {
        this.loader = false;
        console.log("all users", users['user'])
        this.allUser[i].activation = users['user'].activation;
        console.log("this.allUser[i]", this.allUser[i]);
        this._flashMessagesService.show(users['message'], { cssClass: 'alert-success' });
      } else {
        this._flashMessagesService.show(users['message'], { cssClass: 'alert-danger' });
      }
    }, (err) => {
      console.log(err);
    });
  }

  activate(email, i) {
    console.log("email", email);
    this.musicService.activate(this.header, email).then((users) => {
      console.log('users', users);
      if (users['success'] == true) {
        this.loader = false;
        console.log("all users", users['user'])
        this.allUser[i].activation = users['user'].activation;
        console.log("this.allUser[i]", this.allUser[i]);
        this._flashMessagesService.show(users['message'], { cssClass: 'alert-success' });
      } else {
        this._flashMessagesService.show(users['message'], { cssClass: 'alert-danger' });
      }
    }, (err) => {
      console.log(err);
    });
  }

  getAllUser(email) {
    console.log("email", email);
    this.musicService.getAllUser(this.header, email).then((users) => {
      console.log('users', users);
      if (users['success'] == true) {
        this.loader = false;
        console.log("all users", users['user'])
        this.allUser = users['user'];
        this._flashMessagesService.show(users['message'], { cssClass: 'alert-success' });
      } else {
        this._flashMessagesService.show(users['message'], { cssClass: 'alert-danger' });
      }
    }, (err) => {
      console.log(err);
    });
  }


  updateUser() {
    console.log("userData", this.userData);
    this.loader = true;
    this.musicService.updateUser(this.userData, this.header).then((userDetail) => {
      console.log('userDetail', userDetail);
      console.log('userDetail.success', userDetail['success']);
      console.log('userDetail.message', userDetail['message']);
      if (userDetail['success'] == true) {
        this.user = userDetail['user'];
        this.userData.name = this.user.name;
        this.userData.phone = this.user.phone;
        this.userData.email = this.user.email;
        localStorage.setItem("user", JSON.stringify(this.user));
        if (this.uploader.getNotUploadedItems().length) {
          this.uploader.uploadAll();
          this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this.user.photo = JSON.parse(response).user.photo;
            JSON.parse(localStorage.getItem("user")).photo = JSON.parse(response).user.photo;
            this.loader = false;
            this._flashMessagesService.show(userDetail['message'], { cssClass: 'alert-success' });
          };
        }
        else {
          this.loader = false;
        }
      } else {
        this.loader = false;
        this._flashMessagesService.show(userDetail['message'], { cssClass: 'alert-danger' });
      }
    }, (err) => {
      this.loader = false;
      console.log(err);
    });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("header");
    this.router.navigate(['/login']);
  }

}
