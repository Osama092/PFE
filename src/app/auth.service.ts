import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public tokenExpiration$: Observable<number> = this.tokenExpirationSubject.asObservable();

  constructor(private router: Router) {
    // Start a timer to check token expiration every second
    timer(0, 1000).pipe(
      map(() => this.getExpirationTime())
    ).subscribe(expirationTime => {
      this.tokenExpirationSubject.next(expirationTime);
      const currentTime = Date.now();
      const expirationBuffer = 6000000000000000000000000000000; // 1 minute in milliseconds
      if (expirationTime && expirationTime <= currentTime + expirationBuffer) {
        //this.logout(); // Token expired, logout the user
      }
    });    
  }

  login(token: string, expirationTime: number): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime.toString());

    // Log the initial expiration time in seconds
    console.log('Initial token expiration time:', expirationTime / 1000, 'seconds');
  }

  logout(): void {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    this.router.navigate(['/landing-page']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRemainingTime(): Observable<number> {
    return this.tokenExpiration$.pipe(
      map(expirationTime => expirationTime - Date.now())
    );
  }

  private getExpirationTime(): number {
    const expirationTimeStr = localStorage.getItem('expirationTime');
    if (!expirationTimeStr) return 0;
    return parseInt(expirationTimeStr, 10);
  }

}
