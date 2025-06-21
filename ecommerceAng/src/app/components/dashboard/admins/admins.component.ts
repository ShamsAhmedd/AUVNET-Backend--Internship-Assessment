import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminCrudService } from '../../../shared/services/admin/admin-crud.service';

@Component({
  selector: 'app-admins',
  standalone:false,
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css'],
})
export class AdminsComponent implements OnInit {
  admins: any[] = [];
  currentAdminId: string | null = null;
  isLoading = false;
  messageError = '';
  currentPage = 1;
  itemsPerPage = 5;


  adminForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(private _adminService: AdminCrudService) {}

  ngOnInit(): void {
    this.fetchAdmins();
  }

  fetchAdmins(): void {
    this.isLoading = true;
    this._adminService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.messageError = err.error?.message || 'Failed to load admins';
        this.isLoading = false;
      },
    });
  }

  handleAddOrUpdateAdmin(): void {
    if (this.adminForm.invalid) return;

    this.isLoading = true;
    const data = this.adminForm.value;

    if (this.currentAdminId) {
      this._adminService.updateAdmin(this.currentAdminId, data).subscribe({
        next: () => {
          this.fetchAdmins();
          this.resetForm();
        },
        error: (err) => {
          this.messageError = err.error?.message || 'Update failed';
          this.isLoading = false;
        },
      });
    } else {
      this._adminService.addAdmin(data).subscribe({
        next: () => {
          this.fetchAdmins();
          this.resetForm();
        },
        error: (err) => {
          this.messageError = err.error?.message || 'Create failed';
          this.isLoading = false;
        },
      });
    }
  }

  editAdmin(admin: any): void {
    this.currentAdminId = admin._id;
    this.adminForm.patchValue({
      username: admin.username,
      email: admin.email,
      password: '',
    });
  }

deleteAdmin(id: string): void {
  const loggedInId = localStorage.getItem('userId');

  if (id === loggedInId) {
    alert("You can't delete yourself while logged in.");
    return;
  }

  if (!confirm('Are you sure you want to delete this admin?')) return;

  this._adminService.deleteAdmin(id).subscribe({
    next: () => {
      this.fetchAdmins();
    },
    error: (err) => {
      this.messageError = err.error?.message || 'Delete failed';
    },
  });
}

  resetForm(): void {
    this.adminForm.reset();
    this.currentAdminId = null;
    this.messageError = '';
    this.isLoading = false;
  }
  get paginatedAdmins() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.admins.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.admins.length / this.itemsPerPage);
  }
  changePage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
  }

}
