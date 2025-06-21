import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminCrudService {

  constructor(private _HttpClient: HttpClient, private _Router: Router) {}


  addAdmin(data: any): Observable<any> {
    return this._HttpClient.post('http://localhost:5003/api/admin/addAdmin', data);
  }

  updateAdmin(id: string, data: any): Observable<any> {
    return this._HttpClient.put(`http://localhost:5003/api/admin/updateAdmin/${id}`, data);
  }

  deleteAdmin(id: string): Observable<any> {
    return this._HttpClient.delete(`http://localhost:5003/api/admin/deleteAdmin/${id}`);
  }

    getAllAdmins(): Observable<any[]> {
    return this._HttpClient.get<any[]>('http://localhost:5003/api/admin/getAllAdmins');
  }

}
