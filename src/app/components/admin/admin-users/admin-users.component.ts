import { Component, OnInit } from '@angular/core';
import { SystemUsersService, User } from '../../../services/admin/system-users.service';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})


export class AdminUsersComponent implements OnInit{
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';

  constructor(private userService: SystemUsersService) {}

  ngOnInit(): void {
     this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res) => {
        // const apiUsers = res;
        console.log(res);
        this.users = res;
        this.filteredUsers = [...this.users];
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }


  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      u =>
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.mobile.includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

}
