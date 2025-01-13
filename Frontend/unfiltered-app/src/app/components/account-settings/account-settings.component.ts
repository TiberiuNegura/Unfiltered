import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonEngine } from '@angular/ssr/node';

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

  activeTab: string = 'articles';  // Default active tab
  user = {
    avatarUrl: 'path-to-avatar-image.jpg',  // Replace with actual avatar URL
    nickname: 'UserNickname',
    password: '', // Placeholder, should be handled securely
  };
  hasMoreArticles: boolean = false;
  currentPage: number = 0;

  userArticles: any[] = [];

  constructor() { }

  ngOnInit(): void {
    
  }

  viewArticle(articleId: number) {
  }

  editArticle(articleId: number) {
  }

  updateSettings() {
    // Handle the form submission for updating nickname and password
    console.log('Settings updated:', this.user.nickname, this.user.password);
    // Implement logic to update the user settings (e.g., call an API)
  }

  goToNextPage() {
    
  }

  goToPreviousPage() {
    
  }
}
