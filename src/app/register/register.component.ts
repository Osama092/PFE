import { Component } from '@angular/core';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router'; 
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  user = {

    userFirstName: '',
    userLastName: '',
    userEmail: '',
    userPass: '',
    userPhoneNumber: '',
    confirmPassword: '',
  
  };
  imageUrl = './assets/wm_s_(1)-transformed.png';


  userId!: number;
  emailSentMessage: string = '';
  passwordErrorMessage: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private registerService: RegisterService, private router: Router) {}

  onSubmit() {

    if (
      !this.user.userFirstName.trim() ||
      !this.user.userLastName.trim() ||
      !this.user.userEmail.trim() ||
      !this.user.userPhoneNumber.trim() ||
      !this.user.userPass.trim()
    ) {
      this.successMessage = ""
      this.errorMessage = 'All fields are required.';
      return;
    }
    const formData = new FormData();

  
    formData.append('userFirstName', this.user.userFirstName);
    formData.append('userLastName', this.user.userLastName);
    formData.append('userEmail', this.user.userEmail);
    formData.append('userPhoneNumber', this.user.userPhoneNumber);
    formData.append('userPass', this.user.userPass);

    
    

    this.registerService.registerUser(formData).subscribe(
      (response: any) => {
        if (response instanceof HttpErrorResponse) {
          // Handle HTTP error response (e.g., 404, 500)
          console.error('HTTP error occurred:', response);
          this.successMessage = "";
          this.errorMessage = 'Unexpected server error. Please try again.';
        } else if (typeof response === 'string') {
          // Handle plain text or HTML response (non-JSON)
          console.error('Non-JSON response received:', response);
          this.errorMessage = 'Unexpected server response. Please try again.';
        } else {
          // Assume response is JSON object
          if (response && response.success) {
            // Registration successful
            this.userId = response.userId;
            this.emailSentMessage = response.message;
            this.errorMessage = "";
            this.successMessage = "Verifictiont Email sent successfully.";
            // Additional success handling logic here
          } else {
            // Registration failed (server-side error)
            this.errorMessage = response.message || 'User registration failed. Please try again.';
          }
        }
      },
      (error) => {
        // Handle HTTP request error (e.g., network failure)
        console.error('HTTP request failed:', error);
        this.errorMessage = 'Failed to register user. Please try again later.';
      }
    );
    
    

       

  }

  passwordMatchValidator() {
    if (this.user.userPass !== this.user.confirmPassword) {
      this.passwordErrorMessage = 'Passwords do not match';
    } else {
      this.passwordErrorMessage = '';
    }
  }

  sendVerificationEmail(email: string) {
    this.registerService.sendVerificationEmail(email)
      .subscribe(
        (response) => {
          this.emailSentMessage = 'Verification email sent successfully. Check your email to activate your account.';
        },
        (error) => {
          console.error('Failed to send verification email');
          this.errorMessage = 'Verification email sent successfully. Check your email to activate your account.';
        }
      );
  }

  loginPage() {
    this.router.navigate(['login']);
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  showPasswordWarning: boolean = false;
  showEmailWarning: boolean = false;
  showPhoneNumberWarning: boolean = false;
  showFirstNameWarning: boolean = false;
  showLastNameWarning: boolean = false;

  validateFirstName() {
    const firstNamePattern = /[a-zA-Z]+/;
    this.showFirstNameWarning = !firstNamePattern.test(this.user.userFirstName);

  }
  validateLastName() {
    const lastNamePattern = /[a-zA-Z]+/;
    this.showLastNameWarning = !lastNamePattern.test(this.user.userLastName);

  }

  validateEmail() {
    const emailPattern = /.+@.+?\..+/;

    this.showEmailWarning = !emailPattern.test(this.user.userEmail);
  }

  validatePhoneNumber() {
    const phoneNumberPattern = /^\d{8}$/;
    this.showPhoneNumberWarning = !phoneNumberPattern.test(this.user.userPhoneNumber);
  }

  validatePassword() {
    const passwordPattern =  /^(?=.*[A-Z])(?=.*\d)(?=.*[\{\}!@#$%^&*()-_+=|\\[\]{};:'"<>,.?\/])[A-Za-z\d\{\}!@#$%^&*()-_+=|\\[\]{};:'"<>,.?\/]{8,}$/;

    this.showPasswordWarning = !passwordPattern.test(this.user.userPass);
  }

  
  

}
