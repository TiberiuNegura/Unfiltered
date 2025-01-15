import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { response } from 'express';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    UserCardComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchType: 'articles' | 'users' = 'articles'; // Default search type
  showFilter: boolean = false; // Controls filter visibility
  selectedCategory: string = ''; // Holds the selected category
  categories: any = [
    { _id: '-1', name: 'All' },
    { _id: '1', name: 'Technology' },
    { _id: '2', name: 'Lifestyle' },
    { _id: '3', name: 'Education' },
    { _id: '4', name: 'Politics' },
    { _id: '5', name: 'Rants' }
  ]
  articles: any[] = [];
  users: any[] = [];
  searchQuery: string = ''; // The text entered in the search bar
  currentPage: number = 0;
  limit: number = 10;
  hasMoreArticles: boolean = false;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadArticles();
  }

  // Sets the current search type
  setSearchType(type: 'articles' | 'users'): void {
    this.searchType = type;
    this.showFilter = false;
    this.currentPage = 0;

    if (type == 'articles') {
      this.loadArticles();
    } else {
      this.loadUsers();
    }
  }

  // Toggles the filter visibility
  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  // Fetches articles based on the current search query and category filter
  loadArticles(): void {
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

  // Fetches users based on the current search query
  loadUsers(): void {
    this.apiService.getUsers(this.currentPage)
      .subscribe({
        next: (response: any) => {
          console.log(response)
          this.users = response.map((user: any) => {
            return {
              id: user.id,
              nickname: user.nickname
            }
          });
          this.hasMoreArticles = response.length === this.limit;
        },
        error: (response: any) => {
          console.log(response);
        }
      });
  }

  // Handles the search bar input
  onSearch(event: Event): void {
    if (this.searchType === 'articles') {
      this.currentPage = 0;
      const input = (event.target as HTMLInputElement).value;
      this.searchQuery = input.trim();
      this.apiService.getArticlesByTitle(this.currentPage, this.searchQuery)
        .subscribe({
          next: (response: any) => {
            const articlesArray = Array.isArray(response) ? response : [response];

            this.articles = articlesArray.map((article: any) => {
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
            console.error("Error")
          }
        });
    } else if (this.searchType === 'users') {
      this.currentPage = 0;
      const input = (event.target as HTMLInputElement).value;
      this.searchQuery = input.trim();
      console.log(this.searchQuery)
      this.apiService.getUsersByNickname(this.currentPage, this.searchQuery)
        .subscribe({
          next: (response: any) => {
            this.users = response.map((user: any) => {
              return {
                id: user.id,
                nickname: user.nickname
              }
            });
            this.hasMoreArticles = response.length === this.limit;
          },
          error: () => {
            console.error("Error")
          }
        });
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadArticles();
    }
  }

  goToNextPage(): void {
    if (this.hasMoreArticles) {
      this.currentPage++;
      this.loadArticles();
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

  mapCategoryId(category: string): number {
    const categories: { [key: string]: number } = {
      'Technology': 1,
      'Lifestyle': 2,
      'Education': 3,
      'Politics': 4,
      'Rants': 5,
    };

    return categories[category] || -1;
  }

  onCategorySelected(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value.toString();
    const categoryId = this.mapCategoryId(selectedValue);
    if (categoryId == -1) {
      this.loadArticles();
      return;
    }

    this.apiService.getArticlesByCategory(this.currentPage, categoryId)
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
          this.loadArticles();
        }
      });
  }
}
