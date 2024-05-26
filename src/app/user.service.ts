import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { Address } from './address';
import { Order } from './order';
import { Sale } from './sale';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private baseUrl = "http://localhost:8034/restapi/user";

  private addressBaseUrl = "http://localhost:8034/restapi/address";
  private orderBaseUrl = "http://localhost:8034/restapi/order";
  private saleBaseUrl = "http://localhost:8034/restapi/sale";
  public orderCount!: number; // Global variable to store the order count

  private tokenKey = 'token';
  private expirationKey = 'tokenExpiration';

  constructor(private httpClient: HttpClient) { }



  getUserById(userId: number): Observable<User> {
    const url = `${this.baseUrl}/${userId}`;
    return this.httpClient.get<User>(url);
  }

  updateUser(userId: number, updatedUser: User): Observable<User> {
    const url = `${this.baseUrl}/${userId}`;
    return this.httpClient.put<User>(url, updatedUser);
  }

  resetPassword(userId: number, newPassword: string): Observable<void> {
    const url = `${this.baseUrl}/rest-password/${userId}`;
    const body = { userPass: newPassword };
    return this.httpClient.put<void>(url, body);
  }

  sendContactEmail(userUsername: string, userEmail: string, message: string): Observable<any> {
    const requestBody = {
      userUsername: userUsername,
      userEmail: userEmail,
      message: message
    };

    return this.httpClient.post<any>(`${this.baseUrl}/send-contact-email`, requestBody);
  }

  login(userEmail: string, userPass: string): Observable<User> {
    const loginRequest = { userEmail, userPass };

    const loginUrl = `${this.baseUrl}/login`;

    return this.httpClient.post<User>(loginUrl, loginRequest, { observe: 'response'})
    .pipe(
      map(response => {
        const token = response.headers.get('Authorization'); // Get the token from response headers
        if (token) {
          this.saveToken(token); // Save token if present
        } else {
          console.warn('No JWT token found in response headers');
        }

        if (!response.body) {
          throw new Error('Invalid response body');
        }

        return response.body; // Return the user object from the response body
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError('Failed to login. Please check your credentials and try again.');
      })
    );

  }

  saveUserInfo(user: User): void {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token); // Store token in localStorage
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Retrieve token from localStorage
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // Check if a token is present (user is logged in)
  }

  isTokenExpired(): boolean {
    const expirationDate = localStorage.getItem(this.expirationKey);
    if (!expirationDate) {
      return true;
    }
    return parseInt(expirationDate, 10) < new Date().getTime();
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove token from localStorage (logout)
  }

  // User Addresses

  updateUserAddress(addressId: number, updatedUserAddress: Address): Observable<Address> {
    const url = `${this.addressBaseUrl}/${addressId}`;
    return this.httpClient.put<Address>(url, updatedUserAddress);
  }

  addUserAddress(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.addressBaseUrl}`, formData);
  }

  getUserAddress(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.addressBaseUrl}`);

  }
  /*
  getAddressByHolder(addressHolder: string): Observable<any> {
    const url = `${this.addressBaseUrl}/getAddressHolder/${addressHolder}`;
    return this.httpClient.get<any>(url);
  }
  */
  
  getAddressByHolder(addressHolder: string): Observable<Address> {
    const url = `${this.addressBaseUrl}/getAddressHolder/${addressHolder}`;
    return this.httpClient.get<Address>(url);
  }



  
  sendReportEmail(report: string): Observable<any> {
    const productInfo = JSON.parse(localStorage.getItem('productInfo') || '{}');
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const requestBody = {
      userId: userInfo.userId,
      userUsername: userInfo.userUsername,
      userProfilePic: userInfo.userProfilePic,
      userFirstName: userInfo.userFirstName,
      userLastName: userInfo.userLastName,
      userEmail: userInfo.userEmail,
      productId: productInfo.productId,
      report: report
    };
    return this.httpClient.post<any>('http://localhost:8034/restapi/user/send-report-email', requestBody);
  }
  
  
  //user orders

  getOrder(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.orderBaseUrl}`);
  }

  getOrderBySeller(orderSeller: number): Observable<Order> {
    const url = `${this.orderBaseUrl}/getOrderSeller/${orderSeller}`;
    return this.httpClient.get<Order>(url);
  }
  
  getOrderByBuyer(orderBuyer: number): Observable<Order> {
    const url = `${this.orderBaseUrl}/getOrderBuyer/${orderBuyer}`;
    return this.httpClient.get<Order>(url);
  }

  addOrder(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.orderBaseUrl}/addOrder`, formData);
  }

  getCountOfOrdersByBuyer(orderBuyer: number): Observable<number> {
    return this.httpClient.get<number>(`${this.orderBaseUrl}/count/${orderBuyer}`);
  }
  //user sales

  getSale(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.saleBaseUrl}`);

  }

  getSaleBySeller(saleSeller: number): Observable<Sale> {
    const url = `${this.saleBaseUrl}/getSaleSeller/${saleSeller}`;
    return this.httpClient.get<Sale>(url);
  }
  


  addSale(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.saleBaseUrl}/addSale`, formData);
  }

  

}
