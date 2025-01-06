import { Component } from '@angular/core';
import { AuthComponent } from '../auth/auth.component';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [AuthComponent, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(
    private apiService: ApiService
  ) {}

  user: User = new User();

  userName: string = '';
  nickname: string = '';
  password: string = '';
  confirmPwd: string = '';

  errorMessage: string = '';


 onSubmit() {
     console.log('Submitted!');
 
     this.user.username = this.userName;
     this.user.password = this.password;
     this.user.nickname = this.nickname;

     console.log(this.user);

     if(this.password != this.confirmPwd) {
      this.errorMessage = 'Passwords do not match!';
     } else {
      this.apiService.authenticate(this.user, false);
    }
     console.log(this.errorMessage);
   }
}
