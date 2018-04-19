import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HistoryService {
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


  //Function to get history comment of user
 


  getHistoryComment(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'historys/historyComment', this.options).map(res => res.json());
  }
}
