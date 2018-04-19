import { FollowService } from './../../../services/follow.service';
import { AuthService } from './../../../services/auth.service';
import { EvalService } from './../../../services/eval.service';
import { CommentService } from './../../../services/comment.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ItemService } from './../../../services/item.service';
import { Component, OnInit, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { MaterializeAction } from 'angular2-materialize';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'rank-item',
  templateUrl: './rank-item.component.html',
  styleUrls: ['./rank-item.component.css']
})
export class RankItemComponent implements OnInit {

  closeResult: string;
  currentUrl;
  singleEval;
  nbrComment;
  item;
  commentForm;
  allComments;
  evalForm;
  evalForm2;
  eval;
  chart;
  chartBarService;
  chartBarQuality;
  chartBarPrice;
  username;
  image = "";
  formData = new FormData();
  logged;
  followers = [];
  totalFollowers: number;
  followButton = true;
  unfollowButton = false;
  evalButton = false;
  updateEvalButton = true;
  evals;

  constructor(
    private itemService: ItemService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private evalService: EvalService,
    private authService: AuthService,
    private elem: ElementRef,
    private followService: FollowService,
    private modalService: NgbModal
  ) {
    this.currentUrl = this.activatedRoute.snapshot.params;    
    this.createCommentForm();
    this.createEvalForm();
    this.UpdateEvalForm();
    const user = localStorage.getItem('user');
    this.logged = JSON.parse(user);
    //const u = us.username;
    const itm = this.activatedRoute.snapshot.params.id;
    this.followService.getFollowers(itm).subscribe(res => {
      this.followers = res.follow;
      // console.log(this.followers);
      this.totalFollowers = this.followers.length;
      this.authService.getProfile().subscribe(profile => {
        const username = profile.user._id;


        for (var i = 0; i < this.followers.length; i++) {

          if (this.followers[i].follower == null || this.followers[i].follower == '') {

            this.followButton = true;
            this.unfollowButton = false;

          } else {
            if (this.followers[i].follower != username) {
              this.followButton = true;
              this.unfollowButton = false;
              // console.log(this.followers[i].follower);
            }
            else {
              this.followButton = false;
              this.unfollowButton = true;
              console.log("egal username");
            }
          }
        }
      })
    })


    this.evalService.getSingleEval(this.currentUrl.id).subscribe(data => {
      this.authService.getProfile().subscribe(profile => {
        if(data.eval.evaluatBy == profile.user._id){
          this.updateEvalButton = false;
          this.evalButton = true;
        }
      });        
    });
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }





  postComment(id, idEval?) {
    const comment = this.evalForm.get('comment').value;
    this.commentService.postComment(id, comment, idEval).subscribe(data => {
      console.log(data);
      this.getAllComments(id);
      this.evalForm.reset();
    });
  }

  postComment2(id) {
    const comment = this.commentForm.get('comment').value;
    console.log(comment);
    this.commentService.postComment(id, comment).subscribe(data => {
      console.log(data);
      this.getAllComments(id);
      this.commentForm.reset();
    });
  }

  getAllComments(id) {
    this.commentService.getAllComments(id).subscribe(data => {
      this.allComments = data.comment;
      this.nbrComment = this.allComments.length;
      console.log("le nombre de commentaire",this.allComments.length);
    })
  }

  cancelSubmission(id) {
    this.commentForm.reset();
  }

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    })
  }

  UpdateEvalForm(){
    this.evalForm2 = this.formBuilder.group({
      price: ['', Validators.required],
      service: ['', Validators.required],
      quality: ['', Validators.required],
    });
  }

  createEvalForm() {
    this.evalForm = this.formBuilder.group({
      price: ['', Validators.required],
      service: ['', Validators.required],
      quality: ['', Validators.required],
      comment: ['', Validators.required],
      image: null
    })
  }

  changeListner(event) {
    const reader = new FileReader();
    const image = this.elem.nativeElement.querySelector('.image');
    reader.onload = function (e) {
      const src = e.target['result'];
      image.src = src;
    };
    let file = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.evalForm.get('image').setValue({
        filename: file.name,
        filetype: file.type,
        value: reader.result.split(',')[1]
      })
    };
    console.log('image capturé ' + event.target.files[0]);
    this.formData.append('image', event.target.files[0]);
  }

  onEvalSubmit() {
    const ev = {
      price: this.evalForm.get('price').value,
      service: this.evalForm.get('service').value,
      quality: this.evalForm.get('quality').value,
      image: this.evalForm.get('image').value,
      evaluatBy: this.username,
      itm: this.currentUrl.id
    }
    console.log(ev);
    this.evalService.newEval(this.currentUrl.id, ev).subscribe(data => {
      if(data.success){
        let evalId = data.eval_id;
        if(this.evalForm.get('comment').value != "" ){
          this.postComment(this.currentUrl.id, evalId);
        }
      }
      
    });
    window.location.reload();
  }


  

  updatEval(id){
    const ev = {
      price : this.evalForm2.get('price').value,
      service : this.evalForm2.get('service').value,
      quality : this.evalForm2.get('quality').value,
    }
    this.evalService.updateEval(this.currentUrl.id, ev).subscribe(data => {
      console.log(data);
      window.location.reload();
    })
  }


  getAllEval() {
    this.evalService.getAllEval(this.currentUrl.id).subscribe(data => {
      this.eval = data.eval;
      this.evals = data.eval;
      console.log(this.evals[0]._id)
      this.chart = new Chart({
        chart: {
          type: 'pie'
        },
        colors: ['#ec0e0e', '#36ac3b', '#f1ea16'],
        title: {
          text: data.title
        },
        credits: {
          enabled: false
        },
        series: [{
          data: [{ name: "bad", y: data.r }, { name: "cool", y: data.g }, { name: "meduim", y: data.y }]
        }]
      });


      this.chartBarService = new Chart({
        chart: {
          type: 'column'
        },
        colors: ['#ec0e0e', '#36ac3b', '#f1ea16'],
        title: {
          text: 'stat of Service'
        },
        credits: {
          enabled: false
        },
        series: [{
          data: [{ name: "bad", y: data.redService }, { name: "cool", y: data.yellowService }, { name: "meduim", y: data.greenService }]
        }]
      });



      this.chartBarQuality = new Chart({
        chart: {
          type: 'column'
        },
        colors: ['#ec0e0e', '#36ac3b', '#f1ea16'],
        title: {
          text: 'stat of Quality'
        },
        credits: {
          enabled: false
        },
        series: [{
          data: [{ name: "bad", y: data.redQuality }, { name: "cool", y: data.yellowQuality }, { name: "meduim", y: data.greenQuality }]
        }]
      });


      this.chartBarPrice = new Chart({
        chart: {
          type: 'column'
        },
        colors: ['#ec0e0e', '#36ac3b', '#f1ea16'],
        title: {
          text: 'stat of Price'
        },
        credits: {
          enabled: false
        },
        series: [{
          data: [{ name: "bad", y: data.redPrice }, { name: "cool", y: data.yellowPrice }, { name: "meduim", y: data.greenPrice }]
        }]
      });

    });
  }


  //Open/Close modal
  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();  
  openModal() {
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }

  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }

  openModal2(){
    this.modalActions2.emit({ action: "modal", params: ['open'] });
  }

  closeModal2(){
    this.modalActions2.emit({ action: "modal", params: ['close'] });
  }

  //Follow item
  follow(item) {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user._id;
      const follow = {
        follower: this.username,
        following: this.currentUrl.id
      }
      //console.log(follow);
      //First check if it's following already.
      this.followService.verifyFollower(follow).subscribe(data => {
        console.log("resul of verify",data.f);      
        if (data.f == null) {
          console.log("data fergha");
          this.followService.follow(follow).subscribe(res => {
            this.followers.push(res);
            console.log(this.followers);
            window.location.reload();            
          })
        } else {
          console.log('you are already following this item');
        }
      })
    });
  }

  //Unfollow item
  unfollow() {
    console.log(this.followers);
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user._id;




      for (var i = 0; i < this.followers.length; i++) {
        if (this.username == this.followers[i].follower) {
          const id = this.followers[i]._id;
          this.followService.unfollow(id).subscribe(res => {
            console.log('unfollowed');
          });
        }
      }

      window.location.reload();
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.itemService.getOneItem(this.currentUrl.id).subscribe(data => {
      this.item = data.item;
      
    });


    this.evalService.getSingleEval(this.currentUrl.id).subscribe(data => {
      this.singleEval = data.eval;
      // console.log("evaluat By is ", data.eval.evaluatBy);
   });


    this.getAllComments(this.currentUrl.id);
    this.getAllEval();

    

    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      // console.log("user connected is ", profile.user.username);
    });

    //console.log(this.logged.username);
    // this.evalService.getAllEval(this.currentUrl.id).subscribe(data => {
    //   return this.eval = data.g;

    // });
    //console.log(this.allComments);    
  }

}
