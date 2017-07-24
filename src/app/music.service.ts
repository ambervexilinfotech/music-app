import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MusicService {

  constructor(private http: Http) { }

  register(data) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/register', data)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  login(data) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/login', data)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  forget(data) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/forgetPassword', data)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  updateUser(data, option) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/updateUser', data, option)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  addCategory(data, option) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/createCategory', data, option)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  addSongToPlaylist(data, option) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/addSongToPlaylist', data, option)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  addPlaylist(data, option) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/createPlaylist', data, option)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  addSong(data, option) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/createSong', data, option)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getAllCategory(options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/getAllCategory', options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getSearchCategory(search, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/searchCategory/' + search, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  getSearchPlaylist(search, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/searchPlaylist/' + search, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  getSearchSong(search, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/searchSong/' + search, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getAllUser(options, email) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/getAllUser/' + email, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  deactivate(options, email) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/deactivateUser/' + email, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  activate(options, email) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/activateUser/' + email, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  deleteCategoryById(categoryId, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/deleteCategoryById/' + categoryId, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  deleteSongById(songId, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/deleteSongById/' + songId, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  deletePlaylistSongById(songId, playlistId, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/deletePlaylistSongById/' + songId + '/' + playlistId, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  deletePlaylistById(songId, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/deletePlaylistById/' + songId, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getSongByCategoryId(categoryId, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/getSongsByCategoryId/' + categoryId, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  getSongByPlaylistId(playlistId, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/getSongsByPlaylistId/' + playlistId, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  getPlaylistByUserId(userId, options) {
    return new Promise((resolve, reject) => {
      this.http.get('/api/getPlaylistByUserId/' + userId, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

}
