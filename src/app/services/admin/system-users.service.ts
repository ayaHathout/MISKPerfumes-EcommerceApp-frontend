import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';


interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    users: {
      name: string;
      phoneNumber: string;
      email: string;
      birthday: string;
      job: string;
      creditLimit: number;
      interests: string;
    }[];
  };
}

export interface User {
  username: string;
  mobile: string;
  email: string;
  creditLimit: number;
}

@Injectable({
  providedIn: 'root'
})

export class SystemUsersService {

  private apiUrl = 'http://localhost:8085/users';
  constructor(private http: HttpClient){ }

  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => {
        return response.data.users.map(user => ({
          username: user.name,
          mobile: user.phoneNumber,
          email: user.email,
          creditLimit: user.creditLimit,
        }));
      })
    );
  }
}
