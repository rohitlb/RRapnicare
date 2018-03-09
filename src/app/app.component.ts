import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  BASE_URL = environment.server;

  constructor(private http: HttpClient) {}

  getProducts(){
    console.log('This is a test');
  }
}
