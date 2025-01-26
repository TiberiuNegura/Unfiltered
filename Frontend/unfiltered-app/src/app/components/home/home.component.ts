import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Article } from '../../models/article';
import { ErrorCodes } from '../../error.codes';


@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  articles: any[] = [];
  currentPage = 0;
  limit: number = 10;
  hasMoreArticles: boolean = true;
  hasError: boolean = false;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.apiService.getArticles(this.currentPage)
      .subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);
          if(errorCode == ErrorCodes.NO_ARTICLES) {
            this.hasError = true;
            return;
          }
          this.articles = response.data.map((article: any) => {
            return {
              title: article.title,
              content: article.body,
              description: article.description,
              category: this.mapCategory(article.category),
              author: article.author,
              id: article.id
            }
          });
          this.hasMoreArticles = response.data.length === this.limit;
        },
        error: () => {
          console.error("Error fetching articles");
        }
      });
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchArticles();
    }
  }

  goToNextPage(): void {
    if (this.hasMoreArticles) {
      this.currentPage++;
      this.fetchArticles();
    }
  }

  mapCategory(categoryId: number): string {
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
