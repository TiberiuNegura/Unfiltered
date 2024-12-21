import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PostComponent } from './components/post/post.component';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ApiService } from './services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'unfiltered-app';

  //data: any;

  //constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // this.apiService.getData().subscribe(
    //   (response) => {
    //     this.data = response;
    //     console.log('Data from API:', this.data);
    //   },
    //   (error) => {
    //     console.error('Error fetching data:', error);
    //   }
    // );
  }
}
