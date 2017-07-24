import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MusicService } from './../music.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit {
  baseurl = "../..";
  // baseurl="http://43.240.66.86/src";
  user: any;
  header: any;
  loader: boolean = false;
  allSongs = [];
  playlistId: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private _flashMessagesService: FlashMessagesService, public musicService: MusicService) { }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("user")) !== null && JSON.parse(localStorage.getItem("header")) !== null && typeof (JSON.parse(localStorage.getItem("user"))) !== "undefined" && typeof (JSON.parse(localStorage.getItem("header"))) !== "undefined") {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.header = JSON.parse(localStorage.getItem("header"));
      console.log("this.user", this.user);
      console.log("this.header", this.header);
    }

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log("(params['playlistId'])", (params['playlistId']));
      if (typeof (params['playlistId']) != "undefined" && (params['playlistId']) != null) {
        console.log("playlistId", params['playlistId']);
        this.playlistId = params['playlistId'];
        this.getSongByPlaylistId(params['playlistId']);
      }
    });
  }

  getSongByPlaylistId(playlistId) {
    this.loader = true;
    this.musicService.getSongByPlaylistId(playlistId, this.header).then((songs) => {
      console.log('songs', songs);
      if (songs['success'] == true) {
        this.loader = false;
        console.log("all songs", songs['song'])
        if (songs['song'].length > 0) {
          this.allSongs = songs['song'];
          this._flashMessagesService.show(songs['message'], { cssClass: 'alert-success', timeout: 2000 });
        } else {
          this._flashMessagesService.show("No song found", { cssClass: 'alert-success', timeout: 2000 });
        }
      } else {
        this.loader = false;
        this._flashMessagesService.show(songs['message'], { cssClass: 'alert-danger', timeout: 2000 });
      }
    }, (err) => {
      console.log(err);
    });
  }

  deleteSong(songId, i) {
    console.log("in delete song");
    this.musicService.deletePlaylistSongById(songId, this.playlistId, this.header).then((songs) => {
      console.log('songs', songs);
      if (songs['success'] == true) {
        console.log("all songs", songs['song'])
        this.allSongs.splice(i, 1);
        this._flashMessagesService.show(songs['message'], { cssClass: 'alert-success', timeout: 2000 });
      } else {
        this._flashMessagesService.show(songs['message'], { cssClass: 'alert-danger', timeout: 2000 });
      }
    }, (err) => {
      console.log(err);
    });
  }

}
