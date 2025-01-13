import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Article } from '../../models/article';


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
          this.articles = response.map((article: any) => {
            return {
              title: article.title,
              content: article.body,
              description: article.description,
              category: this.mapCategory(article.category),
              author: article.author,
              id: article.id
            }
          });
          this.hasMoreArticles = response.length === this.limit;
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
