import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MusicService } from './../music.service';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  baseurl = "../..";
  // baseurl="http://43.240.66.86/src";

  user: any;
  header: any;
  loader: boolean = false;
  categoryForm: FormGroup;
  categoryData = { name: '', userId: null };
  allCategory = [];
  searchCategory = [];
  searchmessage = '';
  public uploader: FileUploader;
  genre: any;
  categoryId: any;
  constructor(private router: Router, private _flashMessagesService: FlashMessagesService, public formBuilder: FormBuilder, public musicService: MusicService) {
    this.categoryForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      photo: ['', Validators.compose([])],
    });
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("user")) !== null && JSON.parse(localStorage.getItem("header")) !== null && typeof (JSON.parse(localStorage.getItem("user"))) !== "undefined" && typeof (JSON.parse(localStorage.getItem("header"))) !== "undefined") {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.header = JSON.parse(localStorage.getItem("header"));
      this.categoryData.userId = this.user._id;
      console.log("this.user", this.user);
      console.log("this.header", this.header);
      this.uploader = new FileUploader({ url: 'http://localhost:3000/api/uploadCategoryImage/' + this.categoryId });
    }

    this.getAllCategory();

  }

  callSonglist(categoryId) {
    console.log("in call playlist");
    this.router.navigate(['/songlist'], { queryParams: { categoryId: categoryId } });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("header");
    this.router.navigate(['/login']);
  }

  getAllCategory() {
    this.loader = true;
    this.musicService.getAllCategory(this.header).then((categories) => {
      console.log('categories', categories);
      if (categories['success'] == true) {
        this.loader = false;
        console.log("all categories", categories['category'])
        this.allCategory = categories['category'];
        this._flashMessagesService.show(categories['message'], { cssClass: 'alert-success', timeout: 2000 });
      } else {
        this.loader = false;
        this._flashMessagesService.show(categories['message'], { cssClass: 'alert-danger', timeout: 2000 });
      }
    }, (err) => {
      console.log(err);
    });
  }
  getSearchCategory() {
    if (this.searchmessage != '') {
      this.musicService.getSearchCategory(this.searchmessage, this.header).then((categories) => {
        console.log('categories', categories);
        if (categories['success'] == true) {
          console.log("all categories", categories['category'])
          this.searchCategory = categories['category'];
        } else {
          this._flashMessagesService.show(categories['message'], { cssClass: 'alert-danger', timeout: 2000 });
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  deleteCategoryById(categoryId) {
    this.loader = true;
    this.musicService.deleteCategoryById(categoryId, this.header).then((categories) => {
      if (categories['success'] == true) {
        this.loader = false;
        this.allCategory = categories['category'];
        this._flashMessagesService.show(categories['message'], { cssClass: 'alert-success', timeout: 2000 });
      } else {
        this.loader = false;
        this._flashMessagesService.show(categories['message'], { cssClass: 'alert-danger', timeout: 2000 });
      }
    }, (err) => {
      console.log(err);
    });
  }

  addCategory() {
    console.log("categoryData", this.categoryData);

    this.musicService.addCategory(this.categoryData, this.header).then((categoryDetail) => {
      console.log('categoryDetail', categoryDetail);
      console.log('categoryDetail.success', categoryDetail['success']);
      console.log('categoryDetail.message', categoryDetail['message']);

      if (categoryDetail['success'] == true) {
        console.log('categoryDetail.id', categoryDetail['category']._id);
        this.categoryId = categoryDetail['category']._id;
        this.uploader.onBeforeUploadItem = function (item) {
          item.url = 'http://localhost:3000/api/uploadCategoryImage/' + categoryDetail['category']._id;
        };
        if (this.uploader.getNotUploadedItems().length) {
          console.log("upload file");
          this.uploader.uploadAll();
          this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log("JSON.parse(response).category", JSON.parse(response).category);
            this.allCategory.push(JSON.parse(response).category);
            console.log("this.allCategory", this.allCategory);
          };
        } else {
          this.allCategory.push(categoryDetail['category']);
          console.log("this.allCategory", this.allCategory);
        }
        this._flashMessagesService.show(categoryDetail['message'], { cssClass: 'alert-success', timeout: 2000 });
      } else {
        this._flashMessagesService.show(categoryDetail['message'], { cssClass: 'alert-danger', timeout: 2000 });
      }
    }, (err) => {
      console.log(err);
    });
  }

}
