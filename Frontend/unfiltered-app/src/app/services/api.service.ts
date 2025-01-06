import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { log } from 'console';
import { Router } from '@angular/router';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private server = 'http://127.0.0.1:8000/api/';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  public authenticate(user: User, login: boolean) {
    const loginStr: string = login ? '1' : '0';
    let authUrl: string = this.server + 'auth' + '/' + loginStr;

    this.http.post(authUrl, user)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('id', response.userId);
          localStorage.setItem('id', response.token);
          this.router.navigate(['/home']);
        },
        error: (response) => {
          console.log('Register failed');
          console.log(response)
        }
      });
  }

  public getData(): Observable<any> {
    return this.http.get(this.server);
  }

  public postData(data: any): Observable<any> {
    return this.http.post(this.server, data);
  }

  public postArticle(article: Article) {
    let url = this.server + 'post' + localStorage.getItem('id');

    this.http.post(url, article)
      .subscribe({
        next: (response: any) => {

        },
        error: () => {

        }
      });
  }
}
