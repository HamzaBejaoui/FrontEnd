import { RankFilterPipe } from './rank-filter.pipe';
import { CommentService } from './../../services/comment.service';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ItemService } from './../../services/item.service';
import { Component, OnInit, EventEmitter, ElementRef, Pipe } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { EvalService } from '../../services/eval.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css'],
})
export class RankComponent implements OnInit {

  

  itemPosts= [];
  newComment = [];
  commentForm;
  enabledComments = [];
  username;
  t;
  itemData;
  evalForm;
  currentUrl;
  green;
  yellow;
  red;
  allComments;
  d;
  chart;
  form;
  messageClass;
  tab_chart= [];
  message;
  formData = new FormData();

  
  
  constructor(
    private formBuilder: FormBuilder,
    private evalService: EvalService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private itemService: ItemService,
    private commentService: CommentService,
    private router: Router,
    private elem: ElementRef
  ) { 
    this.createCommentForm();
    this.createNewItemForm();
  }

  getAllItems(){
      
    this.itemService.getAllItems().subscribe(data => {
      this.itemPosts = data.items;
      for ( let i= 0 ; i<this.itemPosts.length; i++) {
        this.chart = new Chart({
          chart: {
            type: 'pie'
          },
          plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                }
            }
        },
          colors: ['#ec0e0e', '#36ac3b', '#f1ea16'],
          title: {
            text: this.itemPosts[i].title
          },
          credits: {
            enabled: false
          },
          series: [{
            data: [{name: "bad", y:  this.itemPosts[i].r}, {name:"cool",y: this.itemPosts[i].g}, {name:"meduim",y: this.itemPosts[i].y}]     
          }]
        });
        this.tab_chart.push(this.chart);
        // this.itemPosts[i].ddd = this.chart;
      }
      
      //console.log('dsfsdfsdf ' + JSON.stringify(this.itemPosts) );

    });
  }

 


  postComment(id){
    const comment = this.commentForm.get('comment').value;
    this.commentService.postComment(id, comment).subscribe(data => {
       console.log(data);
      //  this.getAllComments();
       const index = this.newComment.indexOf(id);
       this.newComment.splice(index, 1);
      this.commentForm.reset();
       if(this.enabledComments.indexOf(id) < 0) 
       this.expand(id);
    });
  }

  draftComment(id){
    this.newComment = [];
    this.newComment.push(id);
  }

  cancelSubmission(id){
      this.commentForm.reset();
      }

  createCommentForm(){
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    })
  }


  expand(id){
    this.enabledComments.push(id);
  }

  collapse(id){
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }



  getAllEval(id){
    this.evalService.getAllEval(this.currentUrl.id).subscribe(data => {
      this.green = data.g;
      this.yellow = data.y;
      this.red = data.r;
      console.log(this.green);
    });
  }
 

 //Open/Close modal
 modalActions = new EventEmitter<string | MaterializeAction>();
 openModal() {
   this.modalActions.emit({ action: "modal", params: ['open'] });
 }
 closeModal() {
   this.modalActions.emit({ action: "modal", params: ['close'] });
 }

 createNewItemForm() {
  this.form = this.formBuilder.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    image:null
  })
 }

 changeListner(event) {
  const reader = new FileReader();
  const image = this.elem.nativeElement.querySelector('.image');
  reader.onload = function(e) {
      const src = e.target['result'];
      image.src = src;
  };
  let file= event.target.files[0];
  reader.readAsDataURL(event.target.files[0]);
  reader.onload = () => {
    this.form.get('image').setValue({
      filename: file.name,
      filetype: file.type,
      value: reader.result.split(',')[1]
    })
  };
  console.log ('image capturé ' + event.target.files[0]);
  this.formData.append('image', event.target.files[0]);
}

 onItemSubmit(){
  const item = {
    title: this.form.get('title').value,
    category: this.form.get('category').value,
    description: this.form.get('description').value,
    createdBy: this.username,
    image : this.form.get("image").value
  }

  console.log(item);
  
      this.itemService.newItem(item).subscribe(data => {
        console.log(data);
        window.location.reload();
        
      });
 }


  ngOnInit() {
    // this.authService.getProfile().subscribe(profile => {
    //   this.username = profile.user.username;
    // });
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new blog posts and comments
    });
    this.getAllItems();
    // this.getAllEval(this.currentUrl.id);
    // this.getAllComments();
  }
}