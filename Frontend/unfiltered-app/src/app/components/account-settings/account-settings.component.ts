import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ErrorCodes } from '../../error.codes';

@Component({
  selector: 'app-account-settings',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent implements OnInit {
  activeTab: string = 'articles';
  userNickname: string = '';
  hasMoreArticles: boolean = false;
  currentPage: number = 0;
  userArticles: any[] = [];
  selectedOption: string = '';
  newPassword: string = '';
  newNickname: string = '';
  success: boolean = false;

  hasError: boolean = false;
  hasContent: boolean = true;
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchUser();
    this.fetchArticles();

    console.log(this.userNickname)
  }

  fetchArticles() {
    this.apiService.getArticlesByUserId(this.currentPage, localStorage.getItem('id'))
      ?.subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.NO_ERROR) {
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

          if (errorCode == ErrorCodes.UNAUTHORIZED) {
            this.router.navigate(["/login"]);
            return;
          }

          if (errorCode == ErrorCodes.NO_ARTICLES) {
            this.hasContent = false;
            return;
          }
        },
        error: (response) => {
          console.error("Error fetching articles");
        }
      });
  }

  fetchUser() {
    this.apiService.getUser()
      ?.subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.NO_ERROR) {
            this.userNickname = response.data.nickname;
            return;
          }

          if (errorCode == ErrorCodes.USER_NOT_FOUND) {
            this.hasError = true;
            setTimeout(() => this.hasError = false, 3000);
            this.errorMessage = 'User not found';

            return;
          }

          if (errorCode == ErrorCodes.UNAUTHORIZED) {
            this.router.navigate(["/login"]);
            return;
          }
        },
        error: (response: any) => {
          console.error(response);
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

  deleteArticle(articleId: number) {
    this.apiService.deleteArticle(articleId)
      .subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);
          if (errorCode == ErrorCodes.NO_ERROR) {
            window.location.reload();
            return;
          }

          if (errorCode == ErrorCodes.ARTICLE_DELETE_ERROR) {
            this.hasError = true;
            this.errorMessage = "An error occured!";
            setTimeout(() => this.hasError = false, 3000);
            return;
          }
        },
        error: (response) => {
          console.log(response);
        }
      });
  }

  updateSettings() {
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

  switchTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'articles') {
      this.fetchArticles();
    } else {
      this.fetchUser();
    }
  }

  onDelete() {
    this.apiService.deleteUser()
      ?.subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.ARTICLE_DELETE_ERROR) {
            this.hasError = true;
            this.errorMessage = "An error occured!";
            setTimeout(() => this.hasError = false, 3000);
            return;
          }

          this.router.navigate(["/login"]);
        },
        error: () => {

        }
      });
  }

  cancel() {
    this.selectedOption = '';
  }

  savePassword() {
    this.apiService.updateUserPassword(this.newPassword)
      ?.subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.ARTICLE_DELETE_ERROR) {
            this.hasError = true;
            this.errorMessage = "An error occured!";
            setTimeout(() => this.hasError = false, 3000);
            return;
          }

          if (errorCode == ErrorCodes.NO_ERROR) {
            this.success = true;
            setTimeout(() => this.success = false, 3000);
            return;
          }
        },
        error: (response: any) => {
          console.log(response)
        }
      });
  }

  saveNickname() {
    console.log(this.newNickname)
    this.apiService.updateUserNickname(this.newNickname)
      ?.subscribe({
        next: (response: any) => {
          let errorCode: ErrorCodes = Number(response.code);

          if (errorCode == ErrorCodes.ARTICLE_DELETE_ERROR) {
            this.hasError = true;
            this.errorMessage = "An error occured!";
            setTimeout(() => this.hasError = false, 3000);
            return;
          }
          
          if (errorCode == ErrorCodes.NO_ERROR) {
            this.success = true;
            setTimeout(() => this.success = false, 3000);
            this.fetchUser();
          }
        },
        error: (response: any) => {
          console.log(response)
        }
      });
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  clear() {
    this.success = false;
  }
}
