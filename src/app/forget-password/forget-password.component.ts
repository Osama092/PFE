import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
  
export class ForgetPasswordComponent {

  userEmail!: string
  resetLinkSent: boolean = false;
  resetLinkNotSent: boolean = false;

  constructor(private snackBar: MatSnackBar,private http: HttpClient, public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  onSend(): void {
    this.checkEmailExists(this.userEmail);

    console.log('Sending message...', this.userEmail);
  }

  checkEmailExists(email: string): void {
    console.log('Checking email existence for:', email);
    this.http.get<string>(`http://localhost:8034/restapi/user/check-email?userEmail=${email}`)
      .subscribe(
        response => {
          if (response == "1") {
            console.log("Email does not exists");
            this.resetLinkNotSent = true;
            this.snackBar.open('Email does not exist', 'Close');

          } else {
            const userId = response;
            console.log(`User with ID ${userId} exists`);
            this.resetLinkSent = true;
            this.snackBar.open('Email sent successfully!', 'Close');

      
          }
        },
        error => {
          console.error("Error checking email existence:", error);
          this.snackBar.open('An error occurred', 'Close');

        }
      );
  }
}
