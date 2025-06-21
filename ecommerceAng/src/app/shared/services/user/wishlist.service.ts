import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private baseUrl = 'http://localhost:5003/api/user';

  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

    getWishList(): Observable<any[]> {
      return this._HttpClient.get<any[]>(`${this.baseUrl}/getWishList`);
    }

      addToWishList(productId: string): Observable<any> {
        return this._HttpClient.post(`${this.baseUrl}/addToWishList`, { productId });
      }

      removeFromWishList(id: string): Observable<any> {
        return this._HttpClient.delete(`${this.baseUrl}/removeFromWishList/${id}`);
      }


}
