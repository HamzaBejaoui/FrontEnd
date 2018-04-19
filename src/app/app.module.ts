import { FollowService } from './services/follow.service';
import { CommentService } from './services/comment.service';
import { EvalService } from './services/eval.service';
import { ItemService } from './services/item.service';
import { NotAuthGuard } from './guards/notAuth.guard';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
// import { HttpClientModule } from '@angular/common/http'
import { HttpClientModule } from '@angular/common/http'; 

import { ReactiveFormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartModule} from 'angular-highcharts';
import { MaterializeModule } from "angular2-materialize";
import { ChartsModule } from 'ng2-charts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { BlogComponent } from './components/blog/blog.component';
import { ItemComponent } from './components/item/item.component';
import { RankComponent } from './components/rank/rank.component';
import { EditItemComponent } from './components/item/edit-item/edit-item.component';
import { EvalComponent } from './components/rank/eval/eval.component';
import { RankItemComponent } from './components/rank/rank-item/rank-item.component';
import { SearchComponent } from './components/search/search.component';
import { RankFilterPipe } from './components/rank/rank-filter.pipe';
import { SearchFilterPipe } from './components/search/search-filter.pipe';
import { ClickOutsideDirective } from './components/search/click-outside.directive';
import { HistoryService } from './services/history.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },    
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'item', component: ItemComponent, canActivate: [AuthGuard] },
  { path: 'rank', component: RankComponent, canActivate: [AuthGuard]  },
  { path: 'edit-item/:id', component: EditItemComponent, canActivate: [AuthGuard]  },
  { path: 'rank-item/:id', component: RankItemComponent, canActivate: [AuthGuard]  },
  { path: 'evals/:id', component: EvalComponent, canActivate: [AuthGuard] },  
  { path: '**', component: HomeComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    ItemComponent,
    RankComponent,
    EditItemComponent,
    EvalComponent,
    RankItemComponent,
    SearchComponent,
    RankFilterPipe,
    SearchFilterPipe,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FlashMessagesModule,
    FormsModule,
    ChartModule,
    MaterializeModule,
    ChartsModule,    
    // HttpClientModule ,
    HttpClientModule,
    NgbModule.forRoot(),
    NgxEchartsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
    AuthGuard,
    NotAuthGuard,
    ItemService,
    EvalService,
    CommentService,
    FollowService,
    HistoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
