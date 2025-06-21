import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/admin/product.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  products: any[] = [];
  paginatedProducts: any[] = [];
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;

  constructor(private _ProductService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this._ProductService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
        this.setPaginatedProducts();
        this.isLoading = false;
      },
      error: () => {
        console.error('Error loading products');
        this.isLoading = false;
      }
    });
  }

  setPaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.setPaginatedProducts();
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this._ProductService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p._id !== id);
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        this.setPaginatedProducts();
      },
      error: () => {
        console.error('Error deleting product');
      }
    });
  }
}
