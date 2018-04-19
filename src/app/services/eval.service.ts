import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class EvalService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }


  createAuthenticationHeaders(){
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  newEval(id, ev){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'evals/newEval/' + id , ev , this.options).map(res => res.json());
  }


  getAllEval(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'evals/AllEval/' + id, this.options).map(res => res.json());
  }


  getSingleEval(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'evals/singleEval/' + id, this.options).map(res => res.json());
  }


  updateEval(id, ev){
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'evals/UpdateEval/'+ id, ev,  this.options).map(res => res.json());
  }

}
