import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'http://127.0.0.1:8000/api/';
  private authUrl = '';

  constructor(private http: HttpClient) { }

  authenticate(user: User, login: boolean) {
    this.authUrl = this.url + 'auth' + '/' + login;
    console.log(this.authUrl);
    return this.http.post<User>(this.authUrl, user);
  }

  getData(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(this.url, data);
  }
}
