import { EvalService } from './../../../services/eval.service';
import { ItemService } from './../../../services/item.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-eval',
  templateUrl: './eval.component.html',
  styleUrls: ['./eval.component.css']
})
export class EvalComponent implements OnInit {

  username;
  currentUrl;
  evalForm;
  
  constructor(
    private formBuilder: FormBuilder,
    private evalService: EvalService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private itemService: ItemService
  ) { 
    this.createEvalForm();  
    
  }


  
  onEvalSubmit(){
    const ev = {
      price: this.evalForm.get('price').value,
      service: this.evalForm.get('service').value,
      quality: this.evalForm.get('quality').value,
      evaluatBy: this.username,
      itm: this.currentUrl
    }
    this.evalService.newEval(this.currentUrl.id, ev).subscribe(data => {
      console.log(data);
    });  
  }

  createEvalForm(){
    this.evalForm = this.formBuilder.group({
      price: ['', Validators.required],
      service: ['', Validators.required],
      quality: ['', Validators.required],
      comment: ['', Validators.required]
    })
  }

  getAllEval(){
    this.evalService.getAllEval(this.currentUrl.id).subscribe(data => {
      console.log(data);
    });
  }
 


  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    
        this.authService.getProfile().subscribe(profile => {
          this.username = profile.user.username;
        });
        console.log(this.currentUrl);
        this.getAllEval();
      }
  }


