import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import {  SocialAuthService } from '@abacritt/angularx-social-login';
import { User } from '../user';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userEmail!: string;
  userPass!: string;
  errorMessage: string = '';
  user: any;
  imageUrl = './assets/wm_s-jnLGRBIqU-transformed.webp';



  showPassword: boolean = false;

  constructor(private authService: AuthService,private http: HttpClient, private router: Router, public dialog: MatDialog, private userService: UserService) { }

  
  

  
  login(): void {
    if (!this.userEmail || !this.userPass || !this.userEmail.trim() || !this.userPass.trim()) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    const token = 'example_token';
  const expirationTime = Date.now() + (60 * 1000); // Example expiration time in milliseconds (1 minute from now)

  // Call the login method of AuthService
  this.authService.login(token, expirationTime);

    this.userService.login(this.userEmail, this.userPass)
      .subscribe(
        (user: User) => {
          console.log('Login successful, userId:', user.userId);

          // Save token in localStorage (assuming token is returned from backend)
          if (user.token) {
            this.userService.saveToken(user.token);
          }
          if (user.token) {
            console.log('JWT Token:', user.token);
          } else {
            console.warn('No JWT token found in user response');
          }

          // Save user info in localStorage (if needed)
          this.userService.saveUserInfo(user);

          // Redirect to home page with user ID
          this.router.navigate(['home']);
        },
        error => {
          console.error('Login failed:', error);
          this.errorMessage = 'Failed to login. Please check your credentials and try again.';
        }
      );
  }

  
  
  showEmailWarning: boolean = false;

  
  

  registerPage() {
    this.router.navigate(['register']);
  }

  validateEmail() {
    const emailPattern = /.+@.+?\..+/;

    this.showEmailWarning = !emailPattern.test(this.userEmail);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ForgetPasswordComponent, {
      width: '400px',
      
      data: { title: 'Dialog Box', placeholder: 'Enter something' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }




}