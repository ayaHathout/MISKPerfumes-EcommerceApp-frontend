import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserInfo1 } from '../models/UserInfo1';
import { Address } from '../models/Address';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private email: string = "";

  constructor(private http: HttpClient) {  
    // To get the email of principle
  /*  const token = localStorage.getItem('token');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    this.email = payload?.email;

    console.log("email: " + this.email); 
    console.log("token: " + token); */
  }

  // For Personal tab
  getPersonalInfo1(): Observable<UserInfo1> {
    return this.http.get<any>("http://localhost:8085/users/profile")
    .pipe(
      map(res => {
        console.log("222222ressssssssssss: " + res);
        console.log("22222fname: " + res.data.userInfoDto.userName);
        console.log("2222222email: " + res.data.userInfoDto.email);
        console.log("22222222phone: " + res.data.userInfoDto.phoneNumber);
        console.log("2222222address: " + JSON.stringify(res.data.useraddress, null, 2));
        console.log("2222222address: " + res.data.useraddress.departmentNumber);
        console.log("2222222creditLimit: " + res.data.userInfoDto.creditLimit);

        return {
          name: res.data.userInfoDto.userName,
          email: res.data.userInfoDto.email,
          phoneNumber: res.data.userInfoDto.phoneNumber,
          useraddress: res.data.useraddress,
          creditLimit: res.data.userInfoDto.creditLimit
        } as UserInfo1;
      })
    );
  }

  updatePersonalInfo(data: Partial<UserInfo1>): Observable<any> {
    return this.http.patch("http://localhost:8085/users", data);
  }

  // For adding new address
  addNewAddress(address: Address[]): Observable<any>{
    return this.http.post("http://localhost:8085/addresses", address);
  }

  // For deleting an address
  deleteAddress(id: number): Observable<any>{
    return this.http.delete(`http://localhost:8085/addresses/${id}`);
  }

  // For change password
  changePassword(oldPassword: string, newPassword: string) {
    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return this.http.post<any>('http://localhost:8085/users/chnagePassword', body);
  }

}
