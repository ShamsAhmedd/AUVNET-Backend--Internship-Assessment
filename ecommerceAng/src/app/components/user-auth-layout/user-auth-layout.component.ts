import { Component } from '@angular/core';

@Component({
  selector: 'app-user-auth-layout',
  standalone: false,
  templateUrl: './user-auth-layout.component.html',
  styleUrl: './user-auth-layout.component.css'
})
export class UserAuthLayoutComponent {
  sidebarOpen: boolean = true;

  handleSidebarToggle(isOpen: boolean) {
    this.sidebarOpen = isOpen;
  }
}
