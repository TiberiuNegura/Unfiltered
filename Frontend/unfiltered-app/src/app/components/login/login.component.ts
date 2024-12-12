import { Component } from '@angular/core';
import { AuthComponent } from '../auth/auth.component';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { relative } from 'path';

@Component({
  selector: 'app-login',
  imports: [AuthComponent, RouterLink, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {
  userName: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.router.navigate(['/home']);

    console.log(this.userName)
    console.log(this.password)
  }
}
