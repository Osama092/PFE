import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {


  private baseUrl = 'http://localhost:8034/restapi/user';

  constructor(private httpClient: HttpClient) { }

  registerUser(user: any): Observable<any> {
    const apiUrl = 'http://localhost:8034/restapi/user/register';
    return this.httpClient.post(apiUrl, user);
  }

  sendVerificationEmail(email: string): Observable<any> {
    // Adjust the endpoint based on your backend implementation
    return this.httpClient.post<any>(`${this.baseUrl}/send-verification-email`, { userEmail: email });
  }

}
