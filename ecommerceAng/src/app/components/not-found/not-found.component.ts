import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
constructor(private _Router:Router){}
  navigateBack():void{
    this._Router.navigate(['/home']);
  }
}
