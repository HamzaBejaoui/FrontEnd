import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class ItemService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }


  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken, // Attach token
      })
      
    });
  }
  // Function to create a new item post
  newItem(formData) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'items/newItem',formData, this.options ).map(res =>  res.json());
  }


  getAllItems(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'items/allItems', this.options).map(res => res.json());
  }

  getSingleItem(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'items/singleItem/' + id, this.options).map(res => res.json());
  }

  getOneItem(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'items/oneItem/' + id, this.options).map(res => res.json());
  }

  editItem(item){
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'items/updateItem/', item, this.options).map(res => res.json());
  }

  // Function to post a comment on a item post
  postComment(id, comment) {
    this.createAuthenticationHeaders(); // Create headers
    // Create itemData to pass to backend
    const itemData = {
      id: id,
      comment: comment
    }
    return this.http.post(this.domain + 'items/comment', itemData, this.options).map(res => res.json());

  }

}