import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class CommentService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService:  AuthService,
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }


  // Function to post a comment on a item post
  postComment(id, comment, evalId?) {
    this.createAuthenticationHeaders(); // Create headers
    // Create itemData to pass to backend
    const itemData = {
      id: id,
      comment: comment,
      evalId: evalId
    }
    return this.http.post(this.domain + 'comments/comment', itemData, this.options).map(res => res.json());
  }

  getAllComments(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'comments/allComments/' + id , this.options).map(res => res.json());
  }

}
