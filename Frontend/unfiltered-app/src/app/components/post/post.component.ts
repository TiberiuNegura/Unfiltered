import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Article } from '../../models/article';
import { Router } from '@angular/router';

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
export class PostComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  hasError: boolean = false;
  posted: boolean = false;
  isEdit: boolean = false;
  editArticleId: number = 0;

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

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('edit') != null) {
      this.isEdit = Boolean(this.route.snapshot.paramMap.get('edit'));
    }

    if (!this.isEdit) {
      return;
    }

    if (this.route.snapshot.paramMap.get('editId') != null) {
      this.editArticleId = Number(this.route.snapshot.paramMap.get('editId'));
    }

    this.apiService.getArticle(this.editArticleId)
      .subscribe({
        next: (response: any) => {
          this.blog.data.body = response.body;
          this.blog.data.title = response.title;
          this.blog.data.category = response.category;
          this.blog.data.description = response.description;
          this.blog.loading = false;
        },
        error: () => {

        }
      })
  }

  saveBlog() {
    if (this.isEdit) {
      let updatedArticle: Article = new Article();
      updatedArticle.body = this.blog.data.body;
      updatedArticle.title = this.blog.data.title;
      updatedArticle.description = this.blog.data.description;
      updatedArticle.categoryId = this.blog.data.category;

      console.log(updatedArticle.categoryId);
      console.log(this.blog.data.category);

      this.apiService.updateArticle(this.editArticleId, updatedArticle)
        .subscribe({
          next: () => {
            this.router.navigate(["/account-settings"]);
          },
          error: () => {

          }
        })

      return;
    }

    if (!this.blog.data.title || !this.blog.data.category || !this.blog.data.body) {
      this.blog.error = 'All fields are required!';
      return;
    }

    this.blog.loading = true;
    this.blog.error = '';

    let article: Article = new Article();
    article.body = this.blog.data.body;
    article.title = this.blog.data.title;
    article.description = this.blog.data.description;
    article.categoryId = this.blog.data.category;

    this.apiService.postArticle(article)
      .subscribe({
        next: () => {
          this.blog.loading = false;
          this.posted = true;
          this.router.navigate(['/home']);
        },
        error: () => {
          this.blog.loading = false;
          this.hasError = true;
        }
      });
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
