import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  constructor(private http: HttpClient, private userService: UserService, private route: ActivatedRoute, private router: Router) {}

  errorMessage: string = '';
  imageUrl = './assets/rest-pass-pic.webp';

  showPassword: boolean = false;
  userId: number = this.route.snapshot.params['userId'];
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';

  ngOnInit() {
    this.userId = this.route.snapshot.params['userId'];
    this.token = this.route.snapshot.queryParams['token'];
    console.log('user id',this.userId)
    console.log('token', this.token)
    const date = new Date(Date.now());

    console.log('Date',date)
    if (!this.token) {
      // Handle missing token error
      console.error('Token not provided');

      // Optionally redirect to an error page or handle as needed
      return;
    }

    this.http.get<any>(`http://localhost:8034/restapi/user/${this.userId}`).subscribe(
      (data) => {
        const tokenExpiration = this.extractTokenExpiration(this.token);

        if (tokenExpiration && tokenExpiration < Date.now()) {
          console.log(tokenExpiration)
          console.log(Date.now())
          console.error('Token has expired');
          this.router.navigate(['login']);
          // Handle token expiration error
          // Optionally redirect to an error page or handle as needed
        }
        this.newPassword = data.newPassword;
      
      },
      (error) => {
        console.error('Error fetching user image:', error);
      }
    );
  }

  resetPassword(form: NgForm): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (!this.isPasswordComplex(this.newPassword)) {
      this.errorMessage = 'Password must contain<br> at least 8 characters<br>one uppercase letter<br>one number<br>and one special character.';
      return;
    }

    this.userService.resetPassword(this.userId, this.newPassword).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        this.router.navigate(['login']);

      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  passwordMatchValidator() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
    } else {
      this.errorMessage = '';
    }
  }
  

  private extractTokenExpiration(token: string): number | null {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload['exp'] * 1000; // Convert seconds to milliseconds
    } catch (error) {
      console.error('Error extracting token expiration:', error);
      return null;
    }
  }

  isPasswordComplex(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\{\}!@#$%^&*()-_+=|\\[\]{};:'"<>,.?\/])[A-Za-z\d\{\}!@#$%^&*()-_+=|\\[\]{};:'"<>,.?\/]{8,}$/;
    return regex.test(password);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


}
