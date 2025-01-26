import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { response } from 'express';
import { UserCardComponent } from '../user-card/user-card.component';
import { ErrorCodes } from '../../error.codes';

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

  hasContent: boolean = true;
  errorMessage: string = '';
  contentMessage: string = '';
  hasError: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router
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
    this.hasContent = true;
    this.contentMessage = '';
    this.apiService.getArticles(this.currentPage)
      .subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.NO_ERROR) {
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
            return;
          }

          if (errorCode == ErrorCodes.NO_ARTICLES) {
            this.hasContent = false;
            this.contentMessage = 'No articles available at the moment.';
          }
        },
        error: () => {
          console.error("Error fetching articles");
        }
      });
  }

  // Fetches users based on the current search query
  loadUsers(): void {
    this.hasContent = true;
    this.apiService.getUsers(this.currentPage)
      .subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.NO_ERROR) {
            this.users = response.data.map((user: any) => {
              return {
                nickname: user.nickname
              }
            });
            this.hasMoreArticles = response.data.length === this.limit;

            return;
          }

          if (errorCode == ErrorCodes.NO_USERS) {
            this.hasContent = false;
            this.contentMessage = 'No users available at the moment.';
          }
        },
        error: (response: any) => {
          console.log(response);
        }
      });
  }

  // Handles the search bar input
  onSearch(event: Event): void {
    this.hasContent = true;
    this.contentMessage = '';

    if (this.searchType === 'articles') {
      this.articles = [];
      this.currentPage = 0;
      const input = (event.target as HTMLInputElement).value;
      this.searchQuery = input.trim();
      this.apiService.getArticlesByTitle(this.currentPage, this.searchQuery)
        .subscribe({
          next: (response: any) => {
            let errorCode: ErrorCodes = Number(response.code);

            if (errorCode == ErrorCodes.NO_ERROR) {
              const articlesArray = Array.isArray(response.data) ? response.data : [response.data];

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
              this.hasMoreArticles = response.data.length === this.limit;
            }

            if (errorCode == ErrorCodes.NO_ARTICLES) {
              this.hasContent = false;
              this.contentMessage = 'No articles with this title found.';
            }
          },
          error: () => {
            console.error("Error")
          }
        });
    } else if (this.searchType === 'users') {
      this.users = [];
      this.currentPage = 0;
      const input = (event.target as HTMLInputElement).value;
      this.searchQuery = input.trim();
      console.log(this.searchQuery)
      this.apiService.getUsersByNickname(this.currentPage, this.searchQuery)
        .subscribe({
          next: (response: any) => {
            let errorCode: ErrorCodes = Number(response.code);

            if (errorCode == ErrorCodes.NO_ERROR) {
              this.users = response.data.map((user: any) => {
                return {
                  nickname: user.nickname
                }
              });
              this.hasMoreArticles = response.data.length === this.limit;

              return;
            }

            if (errorCode == ErrorCodes.NO_USERS) {
              this.hasContent = false;
              this.contentMessage = 'No users with this nickname found.';
            }
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
    this.hasContent = true;
    this.contentMessage = '';

    const selectedValue = (event.target as HTMLSelectElement).value.toString();
    const categoryId = this.mapCategoryId(selectedValue);
    if (categoryId == -1) {
      this.loadArticles();
      return;
    }

    this.articles = [];
    this.apiService.getArticlesByCategory(this.currentPage, categoryId)
      .subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.NO_ERROR) {
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
          }

          if (errorCode == ErrorCodes.NO_ARTICLES) {
            this.hasContent = false;
            this.contentMessage = 'No articles on this category found.';
          }

          if (errorCode == ErrorCodes.INVALID_REQUEST) {
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          console.error("Error fetching articles");
          this.loadArticles();
        }
      });
  }
}
