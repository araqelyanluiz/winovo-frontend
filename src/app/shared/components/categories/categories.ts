import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CategoriesService } from './services/categories.service';
import { GameCategory } from './models/categories.model';
import { Icon } from "../icon/icon";

@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterModule, TranslateModule, Icon],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoriesService = inject(CategoriesService);
  
  categories = signal<GameCategory[]>([]);
  loading = signal(true);
  
  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading.set(false);
      }
    });
  }
}
