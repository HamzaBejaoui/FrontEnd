import { Router } from '@angular/router';
import { ItemService } from './../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ElementRef,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  messageClass;
  message;
  newItem = false;
  loadingItems = false;
  form;
  processing = false;
  username;
  img;
  title;
  image="";
  formData = new FormData();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private itemService: ItemService,
    private router: Router,
    private elem: ElementRef
  ) {
    this.createNewItemForm();
  }

  createNewItemForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      //.compose([
      //   Validators.required,
      //   Validators.maxLength(50),
      //   Validators.minLength(2),
      //   //this.alphaNumericValidation
      // ])],
      category: ['', Validators.required],
      // .compose([
      //   Validators.required,
      //   Validators.maxLength(50),
      //   Validators.minLength(2),
        //this.alphaNumericValidation
      //])],
      description: ['', Validators.required],
      // .compose([
      //   Validators.required,
      //   Validators.maxLength(500),
      //   Validators.minLength(2)
      image:null
    })
  };


  reloadItems() {
    this.loadingItems = true;

    // setTimeout(() => {
    //   this.loadingItems = false;
    // }, 2000)
  }

  enableFormNewItemForm() {
    this.form.get('title').enable();
    this.form.get('category').enable();
    this.form.get('description').enable();
  }

  disableFormNewItemForm() {
    this.form.get('title').disable();
    this.form.get('category').disable();
    this.form.get('description').disable();
  }




  // alphaNumericValidation(controls) {
  //   const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
  //   if (regExp.test(controls.value)) {
  //     return null;
  //   } else {
  //     return { 'alphaNumericValidation': true }
  //   }
  // }


  // newItemForm() {
  //   this.newItem = true;
  // }

  /*
  fileChange(event){
    const files = this.elem.nativeElement.querySelector('#uploadfile').files;
    const file = files[0];

    // let fileList: FileList = event.target.files;
    // if (fileList.length > 0) {
    //   let file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('uploadfile', file, file.name);
      
    //}
  }
  */
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
  onItemSubmit() {
/*
    const files = this.elem.nativeElement.querySelector('#image').files;
    
    const file = files[0]; 
    formData.append('image', file);

    console.log(formData.get('image'));
    this.processing = true;
    this.disableFormNewItemForm();
        
    console.log('data sended from angular : ' + JSON.stringify(item));
    */

    const item = {
      title: this.form.get('title').value,
      category: this.form.get('category').value,
      description: this.form.get('description').value,
      createdBy: this.username,
      image : this.form.get("image").value
    }
    

    // this.formData.append('createdBy', this.username);
    // this.formData.append('title', this.form.get('title').value);
    // this.formData.append('category', this.form.get('category').value);
    // this.formData.append('description', this.form.get('description').value);

    console.log(item);

    this.itemService.newItem(item).subscribe(data => {
      console.log(data);
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableFormNewItemForm();
      }else{
        this.messageClass='alert alert-success';
        this.message = data.message;
        // setTimeout(() => {
        //     this.processing = false;
        //     this.message = false;
        //     this.form.reset();
        //     this.enableFormNewItemForm();
        // }, 2000);
        this.router.navigate(['/rank']);
      }
    });

  }


  cancel() {
    window.location.reload();
  }

  

  ngOnInit() {
     // Get profile username on page load
     this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new blog posts and comments
    });

    
  }

}
