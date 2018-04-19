import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SearchFilterPipe } from './search-filter.pipe';
import { ItemService } from './../../services/item.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  // chart = new Chart({
  //   chart: {
  //     type: 'pie'
  //   },
  //   colors: ['#ec0e0e', '#36ac3b', '#f1ea16'],
  //   title: {
  //     text: 'Adidas'
  //   },
  //   credits: {
  //     enabled: false
  //   },
  //   series: [{
  //     data: [{name: "bad", y: 4}, {name:"cool",y: 92}, {name:"meduim",y: 10}]     
  //   }]
  // });

  // chart1 = new Chart({
  //   chart: {
  //     type: 'pie'
  //   },
  //   colors: ['#ec0e0e', '#36ac3b', '#f1ea16'],
  //   title: {
  //     text: 'Chassure'
  //   },
  //   credits: {
  //     enabled: false
  //   },
  //   series: [{
  //     data: [{name: "bad", y: 2}, {name:"cool",y: 80}, {name:"meduim",y: 6}]     
  //   }]
  // });


  chartOption = {
    title : {
      text: 'IPhone 6',
      subtext: 'Subtitle',
      x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Bad','Medium','Good']
    },
    series : [
        {
            name: 'echart',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:135, name:'Bad'},
                {value:135, name:'Medium'},
                {value:1548, name:'Good'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                }
            }
        }
    ],
    color:["#ea2020","#d4ea20", "#34d037"]
  }




  chartOption2 = {
    title : {
      text: 'SAMSUNG',
      subtext: 'Subtitle',
      x:'center'
  },
  tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
      orient: 'vertical',
      left: 'left',
      data: ['Bad','Medium','Good']
  },
  series : [
      {
          name: 'echart',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
              {value:50, name:'Bad'},
              {value:200, name:'Medium'},
              {value:2000, name:'Good'}
          ],
          itemStyle: {
              emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
      }
  ]
  }

  

  
  search;
  itm;
  form;
  items;
  showDropDown = false;
  constructor(
    private itemService: ItemService,
    private formBuilder: FormBuilder,
    private elem: ElementRef,
    private activatedRoute: ActivatedRoute
  ) { 
    this.searchForm();
  }
  
  searchForm(){
    this.form = this.formBuilder.group({
      search : [''],
      s: ['']
    });
  }



  getAllItem(){
    this.itemService.getAllItems().subscribe(data => {
      this.items = data.items;
      console.log(data);
    })
  }

  toggleDropDown(){
    this.showDropDown =! this.showDropDown;
  }

  selectValue(search){
    let tab_items = [];
    let g = this.search;
    let id_title_selected;
    this.itemService.getAllItems().subscribe(data => {
      tab_items = data.items;
      for(let i=0; i<tab_items.length;i++){
        if(tab_items[i].title == g)
        id_title_selected = tab_items[i]._id;
        window.location.assign("http://localhost:4200/rank-item/" + id_title_selected);
      }
   
    console.log(this.search);
    console.log(tab_items);
   
  })
    //let e = this.activatedRoute.snapshot.params; 
    //let url = "http://localhost:4200/rank-item/";
    //let e = this.elem.nativeElement.querySelrctor();
    //console.log(e);
    //
    this.showDropDown = false;
  }
  

  ngOnInit() {
    this.getAllItem();
    
  }

}
