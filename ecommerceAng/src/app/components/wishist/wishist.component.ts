import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../shared/services/user/wishlist.service'; // adjust path as needed

@Component({
  selector: 'app-wishist',
  standalone: false,
  templateUrl: './wishist.component.html',
  styleUrls: ['./wishist.component.css']
})
export class WishistComponent implements OnInit {
  wishlist: any[] = [];
  paginatedWishlist: any[] = [];
  isLoading = false;
  messageError = '';

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(private _wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.fetchWishlist();
  }

  fetchWishlist(): void {
    this.isLoading = true;
    this._wishlistService.getWishList().subscribe({
      next: (data) => {
        this.wishlist = (data || []).filter(item => item.product && item.product.name);

        this.totalPages = Math.max(1, Math.ceil(this.wishlist.length / this.itemsPerPage));
        this.updatePaginatedList();
        this.isLoading = false;
      },
      error: (err) => {
        this.messageError = err.error?.message || '❌ Failed to load wishlist';
        this.isLoading = false;
      }
    });
  }

  updatePaginatedList(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedWishlist = this.wishlist.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }

  removeFromWishlist(productId: string): void {
    if (!confirm('Remove this product from your wishlist?')) return;

    this._wishlistService.removeFromWishList(productId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(item => item.product?._id !== productId);
        this.totalPages = Math.max(1, Math.ceil(this.wishlist.length / this.itemsPerPage));

        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
        this.updatePaginatedList();
      },
      error: (err) => {
        this.messageError = err.error?.message || '❌ Failed to remove product';
      }
    });
  }
}
