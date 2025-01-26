import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Article } from '../../models/article';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorCodes } from '../../error.codes';

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
  article: Article = new Article();
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
    console.log(this.articleId)
    this.apiService.getArticle(Number(this.articleId))
      .subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.NO_ERROR) {
            this.article.author = response.data.author;
            this.article.body = response.data.body;
            this.article.title = response.data.title;
            this.article.categoryId = response.data.category;

            return;
          }

          if (errorCode == ErrorCodes.ARTICLE_NOT_FOUND) {
            this.hasError = true;
            this.errorMessage = 'Something went wrong, try again later :(';
            setTimeout(
              () => {
                this.hasError = false;
                this.router.navigate(['/home']);
              },
              3000
            );
          }
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
