// import module

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SpinnerComponentModule } from 'ng2-component-spinner';


// Imports commented out for brevity
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MusicService } from './music.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { FileSelectDirective, FileDropDirective, FileUploadModule } from 'ng2-file-upload';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { CategoryComponent } from './category/category.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ProfileComponent } from './profile/profile.component';
import { SonglistComponent } from './songlist/songlist.component';
import { PlaylistDetailComponent } from './playlist-detail/playlist-detail.component';


// Define the routes
const ROUTES = [
  { path: '', redirectTo: 'category', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'playlist', component: PlaylistComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'songlist', component: SonglistComponent },
  { path: 'playlistDetail', component: PlaylistDetailComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    CategoryComponent,
    PlaylistComponent,
    ProfileComponent,
    SonglistComponent,
    PlaylistDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule,
    FileUploadModule,
    ReactiveFormsModule,
    SpinnerComponentModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(ROUTES)
  ],
  providers: [MusicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
