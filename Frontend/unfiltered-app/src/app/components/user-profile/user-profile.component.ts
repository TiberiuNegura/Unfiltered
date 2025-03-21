import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ErrorCodes } from '../../error.codes';

@Component({
  selector: 'app-user-profile',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  userArticles: any[] = []
  currentPage: number = 0;
  userNickname: string = '';
  hasMoreArticles: boolean = false;

  hasError: boolean = false;
  hasContent: boolean = true;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('nickname') != null) {
      this.userNickname = String(this.route.snapshot.paramMap.get('nickname'));
    } else {
      return;
    }

    this.fetchArticles();
  }

  fetchArticles() {
    this.apiService.getArticlesByUserNickname(this.currentPage, this.userNickname)
      .subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.NO_ERROR) {
            this.hasContent = true;
            this.userArticles = response.data.map((article: any) => {
              return {
                title: article.title,
                body: article.body,
                description: article.description,
                category: this.mapCategory(article.category),
                author: article.author,
                id: article.id
              }
            });
          }

          if(errorCode == ErrorCodes.NO_ARTICLES) {
            this.hasContent = false;
            return;
          }

          if(errorCode == ErrorCodes.USER_NOT_FOUND) {
            this.hasError = true;
            this.errorMessage = 'User not found!';
            setTimeout(() => this.hasError = false, 3000);
          }
        },
        error: (response) => {
          console.log(response)
          console.error("Error fetching articles");
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
}
