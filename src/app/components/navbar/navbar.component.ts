import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import{ FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username;
  email = '';
  hide_nav =true;

  constructor(
    private authService: AuthService,
    private router : Router,
    private flashMessagesService: FlashMessagesService
  ) { }

  onLogoutClick(){
    this.authService.logout();
    this.flashMessagesService.show('You are logged out', { cssClass: 'alert-info' });
    this.router.navigate(['/search']);
  }

  ngOnInit() {
     // Once component loads, get user's data to display on profile
     this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Set username
      this.email = profile.user.email; // Set e-mail || this.router.url == "/search"
      if( this.authService.loggedIn()  ){
        this.hide_nav =false;
      }
        
     
    });
  }

}
