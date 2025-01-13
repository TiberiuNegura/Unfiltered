import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Article } from '../../models/article';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-article',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  articleId: string | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  article: Article = new Article();

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
    console.log(this.articleId)
    this.apiService.getArticle(Number(this.articleId))
      .subscribe({
        next: (response: any) => {
          this.article.author = response.author;
          this.article.body = response.body;
          this.article.title = response.title;
          this.article.categoryId = response.category;
        },
        error: (response: any) => {
          console.error(response)
        }
      });
  }

  mapCategory(category: any): string {
    let categoryId: number = Number(category);

    const categories: { [key: number]: string } = {
      1: 'Technology',
      2: 'Lifestyle',
      3: 'Education',
      4: 'Politics',
      5: 'Rants'
    };

    return categories[categoryId] || 'Unknown';
  }
}
