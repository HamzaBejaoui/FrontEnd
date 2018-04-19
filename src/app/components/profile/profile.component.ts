import { HistoryService } from './../../services/history.service';
import { ItemService } from './../../services/item.service';
import { FollowService } from './../../services/follow.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = '';
  comments;
  email = '';
  followers;
  following = [];
  titles = [];
  ids = [];
  itemsCreated = [];
  ItmTitles = new Array();
  constructor(
    private authService: AuthService,
    private followService: FollowService,
    private itemService: ItemService,
    private historyService: HistoryService
  ) { }

  ngOnInit() {



    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Set username
      this.email = profile.user.email; // Set e-mail.
      console.log(profile.user._id);

      this.followService.AllFollowers().subscribe(data => {
        this.followers = data.followers;

        for (let i = 0; i < this.followers.length; i++) {
          if (this.followers[i].follower == profile.user._id)
            this.following.push(this.followers[i].following);
        }

        // console.log("this is the following of the follower", this.following);
        this.itemService.getAllItems().subscribe(data => {

          for (let j = 0; j < this.following.length; j++) {
            for (let i = 0; i < data.items.length; i++) {
              if (this.following[j] == data.items[i]._id) {
                // this.s.push(data.items[i]._id,  data.items[i].title);
                this.ids.push(data.items[i]._id);
                this.titles.push({ 'id': data.items[i]._id, 'title': data.items[i].title });
              }
            }
          }

          for (let i = 0; i < data.items.length; i++) {
            if (profile.user._id == data.items[i].createdBy) {
              this.itemsCreated.push({ 'id': data.items[i]._id, 'title': data.items[i].title });
            }
          }

          this.historyService.getHistoryComment().subscribe(comments => {
            this.comments = comments.comment;
            console.log(this.comments)
            for (let i = 0; i < data.items.length; i++) {
              for (let j = 0; j < this.comments.length; j++) {
                if (this.comments[j].itm == data.items[i]._id) {
                  this.ItmTitles[data.items[i]._id] = data.items[i].title;
                }
              }
            }
            // {"i}
          });

          console.log("titles that will be added on comments table", this.ItmTitles);
          console.log("titles that will be added on comments table", this.titles);
        });
      });
    });
  }
}