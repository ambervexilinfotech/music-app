import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MusicService } from './../music.service';
import { FileUploader } from 'ng2-file-upload';

function _windowWrapper() {
  return window;
}


@Component({
  selector: 'app-songlist',
  templateUrl: './songlist.component.html',
  styleUrls: ['./songlist.component.css'],
})
export class SonglistComponent implements OnInit, AfterViewInit {
  baseurl = "../..";
  // baseurl="http://43.240.66.86/src";

  genres: any;
  user: any;
  header: any;
  loader: boolean = false;
  enablePlaylist: boolean = false;
  songForm: FormGroup;
  songData = { title: '', singer: '', movie: '', album: '', lyricist: '', actors: '', lyrics: '', genre: 'Ramdom', userId: null, categoryId: null };
  allSongs = [];
  playlistForm: FormGroup;
  playlistData = { name: '', userId: null };
  playlistSongForm: FormGroup;
  playlistSongData = { playlistId: null, songId: null };
  userPlaylist = [];
  public uploader: FileUploader;
  public uploaderPhoto: FileUploader;

  // audio player variable
  private window: any = _windowWrapper();
  private timeout: any;
  private startTransition: any;
  private interval: any;

  list: string;
  /**
   * @Input -> custom properties.
   *
   */

  /** Programmatically buttons. */
  @Input() playButton: boolean = false;
  @Input() pauseButton: boolean = false;
  @Input() selectableButton: boolean = false;
  @Input() muteButton: boolean = false;
  /** Array of audio tracks.*/
  @Input() src: Array<string> = [];
  /** Display or not the controls, default: true */
  @Input() controls: boolean = true;
  /** Set autoplay status, default true. */
  @Input() autoplay: boolean = true;
  /** Set loop status, default false. */
  @Input() loop: boolean = false;
  /** Set the volume, default: 1 (max). */
  @Input() volume: number = 1;
  /** Set the start index of the playlist. */
  @Input() startPosition: number = 0;
  /** Number in s, in order to start the transition, default: 5s */
  @Input() transition: number = 5;
  /** Interval in order to set the audio transition, in ms, default: 500ms. */
  @Input() intervalTransition = 500;
  /** Define if transition, default: false. */
  @Input() transitionEnd: boolean = true;
  /** Define the preload status, default metadata. */
  @Input() transitionStart: boolean = false;
  /** Define the preload status, default metadata. */
  @Input() preload: string = 'metadata';
  /** Define the mute status, default false. */
  @Input() muted: boolean = false;
  /**
   * Custom events who could be intercepted.
   * @type {EventEmitter}
   */
  /** Emit the playlist. */
  @Output() playlist = new EventEmitter();
  /** Emit informations on the current video. */
  @Output() current = new EventEmitter();
  /** Emit the progress status of audio dowloading. */
  @Output() progress = new EventEmitter();
  /** Emit downloading status of track. */
  @Output() downloading = new EventEmitter();

  @ViewChild('audioplayer') player;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private _flashMessagesService: FlashMessagesService, public formBuilder: FormBuilder, public musicService: MusicService) {
    this.songForm = formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      singer: ['', Validators.compose([])],
      movie: ['', Validators.compose([])],
      album: ['', Validators.compose([])],
      lyricist: ['', Validators.compose([])],
      actors: ['', Validators.compose([])],
      lyrics: ['', Validators.compose([])],
      genre: ['random', Validators.compose([])],
      // photo: ['', Validators.compose([])],
      audio: ['', Validators.compose([])]
    });

    this.playlistForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      photo: ['', Validators.compose([])],
    });
    this.playlistSongForm = formBuilder.group({
      playlistId: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("user")) !== null && JSON.parse(localStorage.getItem("header")) !== null && typeof (JSON.parse(localStorage.getItem("user"))) !== "undefined" && typeof (JSON.parse(localStorage.getItem("header"))) !== "undefined") {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.header = JSON.parse(localStorage.getItem("header"));
      this.songData.userId = this.user._id;
      this.playlistData.userId = this.user._id;
      console.log("this.user", this.user);
      console.log("this.header", this.header);
      this.getPlaylistByUserId(JSON.parse(localStorage.getItem("user"))._id);
      this.uploader = new FileUploader({ url: 'http://localhost:3000/api/uploadCategoryImage/' });
      this.uploaderPhoto = new FileUploader({ url: 'http://localhost:3000/api/uploadPlaylistImage/' });
    }
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log("(params['categoryId'])", (params['categoryId']));
      if (typeof (params['categoryId']) != "undefined" && (params['categoryId']) != null) {
        this.songData.categoryId = params['categoryId'];
        console.log("this.songData.categoryId", this.songData.categoryId);
        this.getSongByCategoryId(this.songData.categoryId);
      }
    });

    this.genres = [
      { name: 'Ramdom', value: 'Ramdom' },
      { name: 'Jazz', value: 'Jazz' },
      { name: 'Hip Hop Music', value: 'Hip Hop Music' },
      { name: 'Blues', value: 'Blues' },
      { name: 'Folk Music', value: 'Folk Music' },
      { name: 'Rock Music', value: 'Rock Music' },
      { name: 'Pop Music', value: 'Pop Music' },
      { name: 'Rapping', value: 'Rapping' },
      { name: 'Melody', value: 'Melody' },
      { name: 'Bollywood', value: 'Bollywood' },
      { name: 'Bollywood Remix', value: 'Bollywood Remix' },
      { name: 'Bollywood Mushup ', value: 'Bollywood Mushup' },
      { name: 'Romantic ', value: 'Romantic' },
      { name: 'Bollywood Romantic ', value: 'Bollywood Romantic' },
      { name: 'Country Music ', value: 'Country Music' },
      { name: 'Techno ', value: 'Techno' },
      { name: 'Punk Rock ', value: 'Punk Rock' },
      { name: 'Funk ', value: 'Funk' },
      { name: 'Ambient music ', value: 'Ambient music' },
      { name: 'Classic Period ', value: 'Classic Period' },
      { name: 'House Music ', value: 'House Music' },
      { name: 'Disco ', value: 'Disco' },
      { name: 'Orchestra ', value: 'Orchestra' },
      { name: 'Soul Music ', value: 'Soul Music' },
      { name: 'Heavy Metal', value: 'Heavy Metal' },
      { name: 'Trance Music', value: 'Trance Music' },
      { name: 'Electro', value: 'Electro' },
      { name: 'Rhythm and Blues', value: 'Rhythm and Blues' },
      { name: 'Electronic Dance Music', value: 'Electronic Dance Music' },
      { name: 'Instrumental', value: 'Instrumental' },
      { name: 'Sound Track', value: 'Opera' },
      { name: 'Classical Music', value: 'Classical Music' },
    ]

    // /** Init player with the first occurrence of src's array. */
    // if (this.src.length) { this.list = this.src[this.startPosition]; }

  }

  ngAfterViewInit() {
    if (this.transitionEnd) {
      this.player.nativeElement.addEventListener('play', () => this.audioTransition(this.player.nativeElement.duration, this.player.nativeElement.currentTime));
    }

    this.player.nativeElement.addEventListener('ended', () => {

      this.player.nativeElement.volume = this.volume;
      /** Increment array position in order to get next audio track. */
      this.startPosition += 1;
      /** If loop is true && startPosition is at last index then reset the playlist. */
      if (this.startPosition >= this.src.length && this.loop)
        this.startPosition = 0;
      /** Else stop the playlist. */
      if (this.startPosition >= this.src.length && !this.loop)
        return;

      /** Set new src track */
      this.player.nativeElement.src = this.src[this.startPosition];
      /** If onChangeTrack is set, then emit the new track. */

    });

    this.player.nativeElement.addEventListener('loadstart', () => {
      this.emitCurrentTrack();

      if (this.transitionStart)
        this.audioStartTransition(this.intervalTransition);
    });

    this.player.nativeElement.addEventListener('pause', () => {
      /** Reset Timeout && Interval. */
      this.window.clearTimeout(this.timeout);
      this.window.clearInterval(this.interval);
    });

    this.player.nativeElement.addEventListener('progress', (data) => this.downloading.emit(true));
  }
  /** Set programmatically audio controls. */
  play(): void {
    this.player.nativeElement.play();
  }

  pause(): void {
    this.player.nativeElement.pause();
  }

  muteVideo(): void {
    this.player.nativeElement.muted = !this.player.nativeElement.muted;
  }

  previousTrack() {
    /** If first track, then do nothing. */
    if (this.src.indexOf(this.player.nativeElement.src) <= 0) { return; }
    /** Else go back to previous element in track's array. */
    this.player.nativeElement.src = this.src[this.src.indexOf(this.player.nativeElement.src) - 1];
  }

  nextTrack(): void {
    /** If last track, then do nothing. */
    if (this.src.indexOf(this.player.nativeElement.src) >= this.src.length - 1) { return; }

    /** Else, go to the next element in track's array. */
    this.player.nativeElement.src = this.src[this.src.indexOf(this.player.nativeElement.src) + 1];
  }

  /** Audio Transitions */

  /** Set transition audio. */
  audioTransition(trackDuration: number, timeElapsed: number = 0): void {
    /** Clear setInterval if defined. */
    this.window.clearInterval(this.interval);
    /** Check the currentTime elapsed, then set transition if defined. */
    this.timeout = this.setTimeoutDelay(trackDuration, timeElapsed);
  }

  audioStartTransition(interval: number): void {
    /** Start the transition. */
    this.startTransition = this.setIncrementInterval(interval);
  }

  setTimeoutDelay(trackDuration: number, timeElapsed: number): any {
    /** Timeout who correspond to the remaining time of audio player without the transition's time ( by default 5s before the end). */
    return setTimeout(() => {
      this.interval = this.setDecrementInterval(this.intervalTransition);
    }, (trackDuration - timeElapsed) * 1000 - (this.transition * 1000));
  }

  setIncrementInterval(interval: number): any {
    return setInterval(() => {
      /** Define the new player's volume. Increment by step of 10%.*/
      this.player.nativeElement.volume += (this.player.nativeElement.volume * 10) / 100;
      /** Security area in order to avoid error. If the player's volume is around 90%, then stop incrment, set the volume to 1. */
      if (this.player.nativeElement.volume >= 0.9) {
        this.player.nativeElement.volume = 1;
        this.window.clearInterval(this.startTransition);
      }
    }, interval);
  }

  setDecrementInterval(interval: number): any {
    return setInterval(() => {
      /** Decrement the volume by step of 10%. */
      this.player.nativeElement.volume -= (this.player.nativeElement.volume * 10) / 100;
    }, interval);
  }

  /**
   * Emitters
   */
  emitPlayList(): void {
    this.playlist.emit(this.src);
  }

  emitCurrentTrack(): void {
    /**
     * Return an object who will contain: Url of the track, duration, textTrack, volume)
     */
    this.current.emit({
      src: this.player.nativeElement.currentSrc,
      textTracks: this.player.nativeElement.textTracks,
      volume: this.player.nativeElement.volume
    });
  }





  addSong() {
    console.log("songData", this.songData);
    this.loader = true;
    this.musicService.addSong(this.songData, this.header).then((songDetail) => {
      console.log('songDetail', songDetail);
      console.log('songDetail.success', songDetail['success']);
      console.log('songDetail.message', songDetail['message']);
      if (songDetail['success'] == true) {
        console.log('songDetail.id', songDetail['song']._id);
        this.uploader.onBeforeUploadItem = function (item) {
          item.url = 'http://localhost:3000/api/uploadSongImageAudio/' + songDetail['song']._id;
        };


        if (this.uploader.getNotUploadedItems().length) {
          console.log("upload file");
          this.uploader.uploadAll();
          this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log("JSON.parse(response).song", JSON.parse(response));
            this.allSongs.push(JSON.parse(response).song);
            console.log("this.allSongs", this.allSongs);
            this.loader = false;
            this._flashMessagesService.show(songDetail['message'], { cssClass: 'alert-success', timeout: 2000 });
          };
        } else {
          this.allSongs.push(songDetail['category']);
          console.log("this.allCategory", this.allSongs);
          this.loader = false;
          this._flashMessagesService.show(songDetail['message'], { cssClass: 'alert-success', timeout: 2000 });
        }

      } else {
        this.loader = false;
        this._flashMessagesService.show(songDetail['message'], { cssClass: 'alert-danger', timeout: 2000 });
      }
    }, (err) => {
      this.loader = false;
      console.log(err);
    });
  }

  getSongByCategoryId(categoryId) {
    this.loader = true;
    this.musicService.getSongByCategoryId(categoryId, this.header).then((songs) => {
      console.log('songs', songs);
      if (songs['success'] == true) {
        this.loader = false;
        console.log("all songs", songs['song'])
        if (songs['song'].length > 0) {
          this.allSongs = songs['song'];
          for (var i = 0; i < songs['song'].length; i++) {
            this.src.push(this.allSongs[i].audioName);
            if (i == songs['song'].length - 1) {
              if (this.src.length) {
                this.list = this.src[this.startPosition];
                console.log("this.src", this.src);
                console.log("this.list", this.list)
              }
            }
          }


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

  deleteSong(songId, i) {
    console.log("in delete song");
    this.musicService.deleteSongById(songId, this.header).then((songs) => {
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

  storeSongId(SongId) {
    this.playlistSongData.songId = SongId;
    console.log("this.playlistSongData.SongId", this.playlistSongData.songId);
  }


  addSongToPlaylist() {
    console.log("in delete song");
    this.musicService.addSongToPlaylist(this.playlistSongData, this.header).then((playlistData) => {
      console.log('playlistData', playlistData);
      if (playlistData['success'] == true) {
        console.log("all songs", playlistData['playlist'])
        this._flashMessagesService.show(playlistData['message'], { cssClass: 'alert-success', timeout: 2000 });
      } else {
        this._flashMessagesService.show(playlistData['message'], { cssClass: 'alert-danger', timeout: 2000 });
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
        this.enablePlaylist = false;
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



  enableAddPlaylist() {
    this.enablePlaylist = true;
  }


  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("header");
    this.router.navigate(['/login']);
  }

}
