import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../shared/services/admin/categories.service';
import { CategoryFilterService } from '../../shared/services/category-filter.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  categories: any[] = [];
  expanded = new Set<string>();
  selectedCategoryId: string | null = null;
  isCollapsed = false;

  @Output() toggleSidebar = new EventEmitter<boolean>();

  constructor(
    private categoryService: CategoriesService,
    private categoryFilterService: CategoryFilterService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.categoryService.categoryChanged.subscribe(() => {
      this.loadCategories();
    });
  }

  toggleSidebarState(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebar.emit(!this.isCollapsed);
  }

  toggle(category: any): void {
    const id = category._id;
    if (this.expanded.has(id)) {
      this.expanded.delete(id);
    } else {
      this.expanded.add(id);
    }
  }

  onCategoryClick(category: any): void {
    this.toggle(category);
    this.selectedCategoryId = category._id;
    this.categoryFilterService.setSelectedCategory(category._id);
  }

  showAllProducts(): void {
    this.resetFilter();
  }

  resetFilter(): void {
    this.selectedCategoryId = null;
    this.categoryFilterService.setSelectedCategory(null);
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = this.buildTree(data);
      },
      error: () => {
        console.error(' Error loading categories');
      }
    });
  }

  buildTree(categories: any[]): any[] {
    const idMap = new Map<string, any>();
    const roots: any[] = [];

    for (const cat of categories) {
      cat.children = [];
      idMap.set(cat._id, cat);
    }

    for (const cat of categories) {
      const parentId = typeof cat.parent === 'object' ? cat.parent?._id : cat.parent;
      if (parentId && idMap.has(parentId)) {
        idMap.get(parentId).children.push(cat);
      } else {
        roots.push(cat);
      }
    }

    return roots;
  }
}
