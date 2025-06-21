import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/admin/user.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
users: any[] = [];
paginatedUsers: any[] = [];
isLoading = false;
currentPage = 1;
pageSize = 5; 
totalPages = 1;
constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers()
      }

loadUsers() {
  this.isLoading = true;
  this.userService.getAllUsers().subscribe({
    next: (res) => {
      this.users = res;
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      this.changePage(1);
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
    }
  });
}

changePage(page: number) {
  this.currentPage = page;
  const start = (page - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.paginatedUsers = this.users.slice(start, end);
}

deleteUser(id: string) {
  if (confirm("Are you sure you want to delete this user?")) {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }
}
}
