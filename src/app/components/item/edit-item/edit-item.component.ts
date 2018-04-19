import { ItemService } from './../../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  message;
  messageClass;
  item;
  processing = false;
  currentUrl;
  loading = true;

  constructor(
    private location: Location,
    private activatedRoute : ActivatedRoute,
    private itemService: ItemService, 
    private router: Router
  ) { }

  updateItemSubmit(){
    this.processing = true;
    this.itemService.editItem(this.item).subscribe(data => {
      if(!data.succuss){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      }else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.router.navigate(['/rank']);
      }
    });
  }

  goBack(){
    this.location.back();
  }
  

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.itemService.getSingleItem(this.currentUrl.id).subscribe(data => {
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      }else{
        this.item = data.item;
        this.loading = false;
      }
    });
  }

}
