import { Component } from '@angular/core';
import { AuthComponent } from '../auth/auth.component';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { relative } from 'path';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    AuthComponent,
    RouterLink,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {
  userName: string = '';
  password: string = '';
  errorMessage: string = ''; 

  user: User = new User();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  onSubmit() {
    console.log('Submitted!');

    this.user.username = this.userName;
    this.user.password = this.password;

    this.apiService.authenticate(this.user, true)

    console.log(this.errorMessage);
  }
}
