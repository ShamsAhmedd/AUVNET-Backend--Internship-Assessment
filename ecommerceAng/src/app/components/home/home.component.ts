import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/user/product.service';
import { CategoryFilterService } from '../../shared/services/category-filter.service';
import { WishlistService } from '../../shared/services/user/wishlist.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userData: any;
  allProducts: any[] = [];
  Products: any[] = [];
  paginatedProducts: any[] = [];

  selectedCategoryName: string | null = null;
  hasCategoryFilter: boolean = false;

  isLoading = false;
  messageError = '';
  successMessage = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(
    private _ProductService: ProductService,
    private categoryFilterService: CategoryFilterService,
    private _wishlistService: WishlistService,
    private _ToastrService: ToastrService,
    private _router: Router
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.userData = jwtDecode(token);
      } catch {
        console.error('Invalid token format');
      }
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    this.categoryFilterService.selectedCategory$.subscribe((categoryId) => {
      this.filterProducts(categoryId);
    });
  }

  loadProducts(): void {
    this._ProductService.getAllProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.Products = data;
        this.updatePaginatedProducts();
      },
      error: () => {
        this._ToastrService.error('Error loading products');
      }
    });
  }

  filterProducts(categoryId: string | null): void {
    if (!categoryId) {
      this.Products = this.allProducts;
      this.selectedCategoryName = null;
      this.hasCategoryFilter = false;
    } else {
      this.hasCategoryFilter = true;
      this.Products = this.allProducts.filter(p => p.category?._id === categoryId);
      const matchedProduct = this.Products[0];
      this.selectedCategoryName = matchedProduct?.category?.name || 'Selected Category';
    }

    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.Products.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.Products.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToWishList(productId: string): void {
    if (!this.userData || this.userData.type !== 'user') {
      const shouldLogin = confirm('🚫 You must be logged in as a user to add items to your wishlist.\n\nDo you want to log in now?');
      if (shouldLogin) {
        this._router.navigate(['/login']);
      }
      return;
    }

    this.isLoading = true;
    this.messageError = '';
    this.successMessage = '';

    this._wishlistService.addToWishList(productId).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Product added to wishlist successfully';
        this._ToastrService.success(this.successMessage);
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.messageError = err.error?.error || 'Failed to add to wishlist';
        this._ToastrService.error(this.messageError);
        this.isLoading = false;
      }
    });
  }
}
