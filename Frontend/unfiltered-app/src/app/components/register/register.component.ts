import { Component } from '@angular/core';
import { AuthComponent } from '../auth/auth.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ErrorCodes } from './../../error.codes';

@Component({
  selector: 'app-register',
  imports: [
    AuthComponent,
    RouterLink,
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  user: User = new User();

  userName: string = '';
  nickname: string = '';
  password: string = '';
  confirmPwd: string = '';

  errorMessage: string = '';

  hasError: boolean = false;


  onSubmit() {
    this.user.username = this.userName;
    this.user.password = this.password;
    this.user.nickname = this.nickname;

    console.log(this.user);

    if (this.password != this.confirmPwd) {
      this.hasError = true;
      this.errorMessage = 'Passwords do not match!';
      setTimeout(() => this.hasError = false, 3000);
    } else {
      this.apiService.authenticate(this.user, false)
        .subscribe({
          next: (response: any) => {
            let responseCode: ErrorCodes = Number(response.code);
            if (responseCode == ErrorCodes.NO_ERROR) {
              localStorage.setItem('token', response.token);
              this.router.navigate(['/home']);
              return;
            }

            if (responseCode == ErrorCodes.USERNAME_EXISTS) {
              this.hasError = true;
              this.errorMessage = "Username already exists!";
              setTimeout(() => this.hasError = false, 3000);
            }
          },
          error: (response: any) => {
            console.error(response);
          }
        });
    }
  }
}
