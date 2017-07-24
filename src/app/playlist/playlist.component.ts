import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MusicService } from './../music.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  baseurl = "../..";
  // baseurl="http://43.240.66.86/src";

  user: any;
  header: any;
  loader: boolean = false;
  playlistForm: FormGroup;
  playlistData = { name: '', userId: null };
  userPlaylist = [];
  searchPlaylist = [];
  searchmessage = '';
  public uploaderPhoto: FileUploader;
  constructor(private router: Router, private _flashMessagesService: FlashMessagesService, public formBuilder: FormBuilder, public musicService: MusicService) {
    this.playlistForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      photo: ['', Validators.compose([])],
    })
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("user")) !== null && JSON.parse(localStorage.getItem("header")) !== null && typeof (JSON.parse(localStorage.getItem("user"))) !== "undefined" && typeof (JSON.parse(localStorage.getItem("header"))) !== "undefined") {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.header = JSON.parse(localStorage.getItem("header"));
      this.playlistData.userId = this.user._id;
      console.log("this.user", this.user);
      console.log("this.header", this.header);
      this.getPlaylistByUserId(JSON.parse(localStorage.getItem("user"))._id);
      this.uploaderPhoto = new FileUploader({ url: 'http://localhost:3000/api/uploadPlaylistImage/' });
    }
  }

  getSearchPlaylist() {
    if (this.searchmessage != '') {
      this.musicService.getSearchPlaylist(this.searchmessage, this.header).then((playlist) => {
        console.log('playlist', playlist);
        if (playlist['success'] == true) {
          console.log("all categories", playlist['playlist'])
          this.searchPlaylist = playlist['playlist'];
        } else {
          this._flashMessagesService.show(playlist['message'], { cssClass: 'alert-danger', timeout: 2000 });
        }
      }, (err) => {
        console.log(err);
      });
    }
  }


  getPlaylistByUserId(userId) {
    this.musicService.getPlaylistByUserId(userId, this.header).then((playlist) => {
      console.log('playlist', playlist);
      if (playlist['success'] == true) {
        console.log("all playlist", playlist['playlist'])
        if (playlist['playlist'].length > 0) {
          this.userPlaylist = playlist['playlist'];
          this._flashMessagesService.show(playlist['message'], { cssClass: 'alert-success', timeout: 2000 });
        } else {
          this._flashMessagesService.show("No playlist found", { cssClass: 'alert-success', timeout: 2000 });
        }
      } else {
        this._flashMessagesService.show(playlist['message'], { cssClass: 'alert-danger', timeout: 2000 });
      }
    }, (err) => {
      console.log(err);
    });
  }

  addPlaylist() {
    console.log("this.playlistData", this.playlistData);
    this.musicService.addPlaylist(this.playlistData, this.header).then((playlistDetail) => {
      console.log('playlistDetail', playlistDetail);
      console.log('playlistDetail.success', playlistDetail['success']);
      console.log('playlistDetail.message', playlistDetail['message']);

      if (playlistDetail['success'] == true) {
        console.log('playlistDetail.id', playlistDetail['playlist']._id);
        this.uploaderPhoto.onBeforeUploadItem = function (item) {
          item.url = 'http://localhost:3000/api/uploadPlaylistImage/' + playlistDetail['playlist']._id;
        };
        if (this.uploaderPhoto.getNotUploadedItems().length) {
          console.log("upload file");
          this.uploaderPhoto.uploadAll();
          this.uploaderPhoto.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log("JSON.parse(response).playlist", JSON.parse(response).playlist);
            this.userPlaylist.push(JSON.parse(response).playlist);
            console.log("this.userPlaylist", this.userPlaylist);
          };
        } else {
          this.userPlaylist.push(playlistDetail['playlist']);
          console.log("this.allCategory", this.userPlaylist);
        }
        this._flashMessagesService.show(playlistDetail['message'], { cssClass: 'alert-success', timeout: 2000 });
      } else {
        this._flashMessagesService.show(playlistDetail['message'], { cssClass: 'alert-danger', timeout: 2000 });
      }
    }, (err) => {
      console.log(err);
    });
  }

  callPlaylistDetail(playlistId) {
    console.log("in call playlist");
    this.router.navigate(['/playlistDetail'], { queryParams: { playlistId: playlistId } });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("header");
    this.router.navigate(['/login']);
  }



  deletePlaylistById(playlistId, i) {
    console.log("in delete song");
    this.musicService.deletePlaylistById(playlistId, this.header).then((playlist) => {
      console.log('songs', playlist);
      if (playlist['success'] == true) {
        console.log("all playlist", playlist['playlist'])
        this.userPlaylist.splice(i, 1);
        this._flashMessagesService.show(playlist['message'], { cssClass: 'alert-success', timeout: 2000 });
      } else {
        this._flashMessagesService.show(playlist['message'], { cssClass: 'alert-danger', timeout: 2000 });
      }
    }, (err) => {
      console.log(err);
    });
  }


}
