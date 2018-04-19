import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FollowService {

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


    //follow
    follow(follow) {
      this.createAuthenticationHeaders(); 
      const newFollow = {
        follower : follow.follower,
        following : follow.following
      }
      return this.http.post(this.domain + 'follows/follow', JSON.stringify(newFollow), this.options).map(res => res.json());
    }

    //Unfollow
    unfollow(id){
      this.createAuthenticationHeaders();             
      return this.http.delete(this.domain + 'follows/unfollow/' + id, this.options).map(res => res.json());
    }

    //Follow by
    getFollowers(item) {
      this.createAuthenticationHeaders();             
      return this.http.get(this.domain + 'follows/followedBy/' + item, this.options).map(res =>res.json());
    }

    //Get all follow
    AllFollowers(){
      this.createAuthenticationHeaders();
      return this.http.get(this.domain + 'follows/followers', this.options).map(res => res.json());
    }


    //Verify Follower
    verifyFollower(follow){
      this.createAuthenticationHeaders();       
      const newFollow = {
        follower : follow.follower,
        following : follow.following
      }
      return this.http.post(this.domain + 'follows/verifyFollower',JSON.stringify(newFollow), this.options ).map(res => res.json());
    }

}
