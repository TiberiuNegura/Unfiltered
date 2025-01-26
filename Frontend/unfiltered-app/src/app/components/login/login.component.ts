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
import { ErrorCodes } from '../../error.codes';

@Component({
  selector: 'app-login',
  imports: [
    AuthComponent,
    RouterLink,
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userName: string = '';
  password: string = '';
  errorMessage: string = '';
  hasError: boolean = false;
  user: User = new User();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  onSubmit() {
    this.user.username = this.userName;
    this.user.password = this.password;

    this.apiService.authenticate(this.user, true)
      .subscribe({
        next: (response: any) => {
          let responseCode: ErrorCodes = Number(response.code);
          console.log(responseCode)

          if (responseCode == ErrorCodes.NO_ERROR) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/home']);
            return;
          }

          if (responseCode == ErrorCodes.WRONG_USERNAME) {
            this.hasError = true;
            this.errorMessage = "Wrong username!";
            setTimeout(() => this.hasError = false, 3000);
            return;
          }

          if (responseCode == ErrorCodes.WRONG_PASSWORD) {
            this.hasError = true;
            this.errorMessage = "Wrong password!";
            setTimeout(() => this.hasError = false, 3000);
            return;
          }
        },
        error: (response) => {
          console.error(response)
        }
      });
  }
}
