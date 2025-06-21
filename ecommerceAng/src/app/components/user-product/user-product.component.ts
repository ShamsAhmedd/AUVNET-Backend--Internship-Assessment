import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/user/product.service';
import { CategoriesService } from '../../shared/services/admin/categories.service';

@Component({
  selector: 'app-user-product',
  standalone: false,
  templateUrl: './user-product.component.html',
  styleUrls: ['./user-product.component.css']
})
export class UserProductComponent implements OnInit {
  productForm: FormGroup;
  products: any[] = [];
  paginatedProducts: any[] = [];
  categories: any[] = [];
  currentProductId: string | null = null;
  @Input() sidebarOpen: boolean = true;

  isLoading = false;
  messageError: string | null = null;

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoriesService
  ) {
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl(''),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      category: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadUserProducts();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => this.categories = res,
      error: (err) => {
        console.error('❌ Category load error:', err);
        this.messageError = '❌ Failed to load categories.';
      }
    });
  }

  loadUserProducts(): void {
    this.productService.getUserProduct().subscribe({
      next: (res) => {
        this.products = res;
        this.currentPage = 1;
        this.updatePaginatedProducts();
      },
      error: (err) => {
        this.messageError = '❌ Failed to load your products.';
      }
    });
  }

  updatePaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleAddOrUpdateProduct(): void {
    if (this.productForm.invalid) return;

    this.isLoading = true;
    const formData = this.productForm.value;

    const request = this.currentProductId
      ? this.productService.updateProduct(this.currentProductId, formData)
      : this.productService.addProduct(formData);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.resetForm();
        this.loadUserProducts();
      },
      error: (err) => {
        this.isLoading = false;
        this.messageError = err.error?.error || '❌ Error saving product. Try again.';
      }
    });
  }

  editProduct(product: any): void {
    this.currentProductId = product._id;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadUserProducts(),
      error: (err) => {
        this.messageError = '❌ Failed to delete product.';
      }
    });
  }

  resetForm(): void {
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      category: ''
    });
    this.currentProductId = null;
  }
}
