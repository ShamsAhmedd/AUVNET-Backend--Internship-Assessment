import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryFilterService {

private selectedCategorySubject = new BehaviorSubject<string | null>(null);
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  setSelectedCategory(categoryId: string | null): void {
    this.selectedCategorySubject.next(categoryId);
  }}
