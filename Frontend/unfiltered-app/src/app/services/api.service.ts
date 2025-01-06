import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { log } from 'console';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'http://127.0.0.1:8000/api/';
  private authUrl = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  public authenticate(user: User, login: boolean) {
    const loginStr: string = login ? '1' : '0';
    this.authUrl = this.url + 'auth' + '/' + loginStr;
    console.log(this.authUrl);
    console.log(user);  

    return this.http.post(this.authUrl, user)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('auth_token', response.token);
          console.log(response.token)
          this.router.navigate(['/home']);
        },
        error: () => {
          console.log('Register failed');
        }
      });
  }

  public getData(): Observable<any> {
    return this.http.get(this.url);
  }

  public postData(data: any): Observable<any> {
    return this.http.post(this.url, data);
  }

  public postArticle(data: any) {
    let currentUser: string = '';
    let currentId: string|null = localStorage.getItem('id');
    if (currentId)
      currentUser = currentId;

    let parameter: HttpParams = new HttpParams();
    parameter.append('user', currentUser);

    this.http.post(this.url, data, {params: parameter})
      .subscribe({
        next: (response: any) => {

        },
        error: () => {

        }
      });
  }
}
