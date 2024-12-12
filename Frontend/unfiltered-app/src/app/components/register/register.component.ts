import { Component } from '@angular/core';
import { AuthComponent } from '../auth/auth.component';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [AuthComponent, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private router: Router) {}

  onSubmit() {
    this.router.navigate(['/home']);
  }
}
