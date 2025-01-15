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
          sessionStorage.setItem('token', response.token);
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
    let url = this.server + 'article/post/' + localStorage.getItem('id');

    return this.http.post(url, article);
  }

  public getArticles(page: number) {
    return this.http.get(`${this.server}article/latest/${page}`);
  }

  public getArticlesByUserNickname(page: number, nickname: string) {
    return this.http.get(`${this.server}article/user/nickname/${nickname}/${page}`);
  }

  public getArticlesByTitle(page: number, title: string) {
    return this.http.get(`${this.server}article/title/${title}/${page}`);
  }

  public getArticlesByUserId(page: number, id: string | null) {
    return this.http.get(`${this.server}article/user/${id}/${page}`);
  }

  public getArticlesByCategory(page: number, category: number) {
    return this.http.get(`${this.server}article/categories/${category}/${page}`);
  }

  public getArticle(articleId: number) {
    return this.http.get(`${this.server}article/${articleId}`);
  }

  public deleteArticle(articleId: number) {
    return this.http.delete(`${this.server}article/delete/${articleId}`);
  }

  public updateArticle(articleId: number, article: Article) {
    return this.http.put(`${this.server}article/update/${articleId}`, article);
  }

  public getUsersByNickname(page: number, nickname: string) {
    return this.http.get(`${this.server}users/${nickname}/${page}`);
  }

  public getUsers(page: number) {
    return this.http.get(`${this.server}latest/users/${page}`);
  }

  public getUser() {
    const id: number = Number(localStorage.getItem('id'));

    return this.http.get(`${this.server}user/${id}`);
  }

  public deleteUser() {
    const id: number = Number(localStorage.getItem('id'));

    return this.http.delete(`${this.server}user/delete/${id}`);
  }

  public updateUser() {
    const id: number = Number(localStorage.getItem('id'));

    return this.http.delete(`${this.server}user/update/${id}`);
  }

  public updateUserNickname(newNickname: string) {
    const id: number = Number(localStorage.getItem('id'));

    const body = {nickname: newNickname};

    return this.http.put(`${this.server}user/update/nickname/${id}`, body);
  }

  public updateUserPassword(newPassword: string) {
    const id: number = Number(localStorage.getItem('id'));

    const body = {password: newPassword};

    return this.http.put(`${this.server}user/update/pwd/${id}`, body);
  }
}
