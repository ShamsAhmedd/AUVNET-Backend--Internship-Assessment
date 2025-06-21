import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private _HttpClient: HttpClient, private _Router: Router) {}


  categoryChanged = new Subject<void>();

  addCategory(data: any): Observable<any> {
    return this._HttpClient.post('http://localhost:5003/api/admin/addCategory', data);
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this._HttpClient.put(`http://localhost:5003/api/admin/updateCategory/${id}`, data);
  }

  deleteCategory(id: string): Observable<any> {
    return this._HttpClient.delete(`http://localhost:5003/api/admin/deleteCategory/${id}`);
  }

  getRootCategories(): Observable<any[]> {
    return this._HttpClient.get<any[]>('http://localhost:5003/api/admin/rootCategories');
  }

  getChildren(id: string): Observable<any[]> {
    return this._HttpClient.get<any[]>(`http://localhost:5003/api/admin/childrenCategories/${id}`);
  }

    getAllCategories(): Observable<any[]> {
    return this._HttpClient.get<any[]>('http://localhost:5003/api/admin/allCategories');
  }

}
