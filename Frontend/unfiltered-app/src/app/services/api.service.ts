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

    return this.http.post(authUrl, user, { withCredentials: true });
  }

  public getData(): Observable<any> {
    return this.http.get(this.server);
  }

  public postData(data: any): Observable<any> {
    return this.http.post(this.server, data);
  }

  public postArticle(article: Article) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let url = this.server + 'article/post';

    return this.http.post(url, article, { headers });
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
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.server}article/user/${page}`, { headers });
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
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.server}user`, { headers });
  }

  public deleteUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.server}user/delete`, { headers });
  }

  public updateUserNickname(newNickname: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = { nickname: newNickname };

    return this.http.put(`${this.server}user/update/nickname`, body, { headers });
  }

  public updateUserPassword(newPassword: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = { password: newPassword };

    return this.http.put(`${this.server}user/update/pwd`, body, { headers });
  }
}
