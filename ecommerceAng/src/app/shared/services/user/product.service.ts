import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:5003/api/user';

  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

  productChanged = new Subject<void>();

  addProduct(data: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/addProduct`, data);
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/updateProduct/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/deleteProduct/${id}`);
  }

  getAllProducts(): Observable<any[]> {
    return this._HttpClient.get<any[]>(`${this.baseUrl}/getAllProduct`);
  }

  getUserProduct(): Observable<any[]> {
    return this._HttpClient.get<any[]>(`${this.baseUrl}/getUserProduct`);
  }

  getProductByCategory(categoryId: string): Observable<any[]> {
    return this._HttpClient.get<any[]>(`${this.baseUrl}/getProductByCategory/${categoryId}`);
  }
}
