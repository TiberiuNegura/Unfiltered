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
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [AuthComponent, RouterLink, FormsModule, RouterModule],
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

    console.log(this.userName);
    console.log(this.password);

    this.apiService.authenticate(this.user, true).subscribe(
      (response: any) => {
        // Store JWT token in local storage
        localStorage.setItem('auth_token', response.token);
        // Redirect to the home page
        this.router.navigate(['/home']);
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = error.error.message || 'Login failed';  // Handle errors
      }
    );

    console.log(this.errorMessage);
  }
}
