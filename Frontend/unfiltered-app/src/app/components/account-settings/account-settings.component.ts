import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

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
  user = {
    nickname: '',
    password: '',
  };
  hasMoreArticles: boolean = false;
  currentPage: number = 0;
  userArticles: any[] = [];
  selectedOption: string = '';
  newPassword: string = '';
  newNickname: string = '';
  success: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchUser();
    this.fetchArticles();

    console.log(this.user.nickname)
  }

  fetchArticles() {
    this.apiService.getArticlesByUserId(this.currentPage, localStorage.getItem('id'))
      .subscribe({
        next: (response: any) => {
          this.userArticles = response.map((article: any) => {
            return {
              title: article.title,
              body: article.body,
              description: article.description,
              category: this.mapCategory(article.category),
              author: article.author,
              id: article.id
            }
          });
        },
        error: (response) => {
          console.error("Error fetching articles");
        }
      });
  }

  fetchUser() {
    this.apiService.getUser()
      .subscribe({
        next: (response: any) => {
          console.log(response.nickname)
          this.user.nickname = response.nickname;
          this.user.password = response.password;
        },
        error: () => {

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
          console.log(response.success);
          if (Boolean(response.success)) {
            window.location.reload();
          }
        },
        error: (response) => {
          console.log(response);
        }
      });
  }

  updateSettings() {
    // Handle the form submission for updating nickname and password
    console.log('Settings updated:', this.user.nickname, this.user.password);
    // Implement logic to update the user settings (e.g., call an API)
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
      .subscribe({
        next: () => {
          this.router.navigate(["/login"]);
        },
        error: () => {

        }
      });
  }

  onSaveChanges() {
    this.apiService.updateUser()
      .subscribe({
        next: () => {

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
      .subscribe({
        next: (response: any) => {
          if (Boolean(response.success)) {
            this.success = true;
            setTimeout(() => this.success = false, 3000);
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
      .subscribe({
        next: (response: any) => {
          console.log(response)
          if (Boolean(response.success)) {
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
