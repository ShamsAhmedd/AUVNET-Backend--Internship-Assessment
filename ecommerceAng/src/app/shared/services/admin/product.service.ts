import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:5003/api/admin';

  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

    getAllProducts(): Observable<any[]> {
      return this._HttpClient.get<any[]>(`${this.baseUrl}/getAllProducts`);
    }

      deleteProduct(id: string): Observable<any> {
        return this._HttpClient.delete(`${this.baseUrl}/deleteProduct/${id}`);
      }


}
