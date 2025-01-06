import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-post',
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

  constructor(
    private apiService: ApiService
  ) {}

  blog = {
    data: {
      title: '',
      category: 0,
      body: '',
      description: ''
    },
    loading: false,
    error: '',
  };

  categoryList = {
    loading: false,
    error: '',
    items: [
      { _id: '1', name: 'Technology' },
      { _id: '2', name: 'Lifestyle' },
      { _id: '3', name: 'Education' },
      { _id: '4', name: 'Politics' },
      { _id: '5', name: 'Rants' }
    ],
  };

  saveBlog() {
    if (!this.blog.data.title || !this.blog.data.category || !this.blog.data.body) {
      this.blog.error = 'All fields are required!';
      return;
    }

    this.blog.loading = true;
    this.blog.error = '';

    this.apiService.postArticle(this.blog);
  }

  resetForm() {
    this.blog.data = {
      title: '',
      category: 0,
      body: '',
      description: ''
    };
  }
}
