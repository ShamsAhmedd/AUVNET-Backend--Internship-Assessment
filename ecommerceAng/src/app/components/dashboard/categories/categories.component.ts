import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../shared/services/admin/categories.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  allCategories: any[] = [];
  childrenByParent: { [parentId: string]: any[] } = {};
  messageError: string | null = null;
  isLoading = false;
  currentCategoryId: string | null = null;

  CategoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    parent: new FormControl(null)
  });

  constructor(private _CategoryService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this._CategoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.allCategories = categories.map(cat => ({
          ...cat,
          parent: typeof cat.parent === 'object' ? cat.parent?._id : cat.parent
        }));
        this.buildTree(this.allCategories);
      },
      error: () => this.messageError = 'Error fetching categories'
    });
  }

  buildTree(categories: any[]): void {
    this.categories = [];
    this.childrenByParent = {};

    for (const cat of categories) {
      const parentId = cat.parent;

      if (parentId) {
        if (!this.childrenByParent[parentId]) {
          this.childrenByParent[parentId] = [];
        }

        const alreadyExists = this.childrenByParent[parentId].some(c => c._id === cat._id);
        if (!alreadyExists) {
          this.childrenByParent[parentId].push(cat);
        }
      } else {
        this.categories.push(cat);
      }
    }
  }

  handleAddOrUpdateCategory(): void {
    if (this.CategoryForm.invalid) return;

    this.isLoading = true;

    const data = {
      name: this.CategoryForm.get('name')?.value,
      parent: this.CategoryForm.get('parent')?.value || null
    };

    const isEdit = !!this.currentCategoryId;
    const oldCategory = isEdit
      ? this.allCategories.find(c => c._id === this.currentCategoryId)
      : null;
    const oldParentId = oldCategory?.parent || null;

    const request$ = isEdit
      ? this._CategoryService.updateCategory(this.currentCategoryId!, data)
      : this._CategoryService.addCategory(data);

    request$.subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.resetForm();

        const normalized = {
          ...res.category,
          parent: typeof res.category.parent === 'object'
            ? res.category.parent?._id
            : res.category.parent
        };

        const index = this.allCategories.findIndex(c => c._id === normalized._id);
        if (index !== -1) {
          this.allCategories[index] = normalized;
        } else {
          this.allCategories.push(normalized);
        }

        if (isEdit && oldParentId && oldParentId !== normalized.parent) {
          const oldChildren = this.childrenByParent[oldParentId];
          if (oldChildren) {
            this.childrenByParent[oldParentId] = oldChildren.filter(c => c._id !== normalized._id);
          }
        }

        const newParentId = normalized.parent;
        if (newParentId) {
          if (!this.childrenByParent[newParentId]) {
            this.childrenByParent[newParentId] = [];
          }
          const alreadyIn = this.childrenByParent[newParentId].some(c => c._id === normalized._id);
          if (!alreadyIn) {
            this.childrenByParent[newParentId].push(normalized);
          }
        }

        if (!normalized.parent) {
          const existsInRoot = this.categories.some(c => c._id === normalized._id);
          if (!existsInRoot) this.categories.push(normalized);
        } else {
          this.categories = this.categories.filter(c => c._id !== normalized._id);
        }

        this._CategoryService.categoryChanged.next();
      },
      error: (err) => {
        this.isLoading = false;
        this.messageError = err.error?.error || (isEdit ? 'Error updating category' : 'Error adding category');
      }
    });
  }

  deleteCategory(id: string): void {
    if (!confirm('Are you sure you want to delete this category?')) return;
    this._CategoryService.deleteCategory(id).subscribe({
      next: () => {
        const idsToRemove = new Set<string>();
        const collectIds = (categoryId: string) => {
          idsToRemove.add(categoryId);
          const children = this.childrenByParent[categoryId] || [];
          for (const child of children) collectIds(child._id);
        };

        collectIds(id);

        this.allCategories = this.allCategories.filter(c => !idsToRemove.has(c._id));
        this.buildTree(this.allCategories);
        this._CategoryService.categoryChanged.next();
      },
      error: (err) => {
        this.messageError = err.error?.error || 'Error deleting category';
      }
    });
  }

  editCategory(category: any): void {
    this.currentCategoryId = category._id;
    const parentId = typeof category.parent === 'object' ? category.parent?._id : category.parent || null;
    this.CategoryForm.patchValue({
      name: category.name,
      parent: parentId
    });
  }

  resetForm(): void {
    this.currentCategoryId = null;
    this.CategoryForm.reset();
  }
}
