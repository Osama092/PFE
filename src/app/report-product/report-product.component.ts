import { Component } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { UserService } from '../user.service';
import { User } from '../user';
import { Observable } from 'rxjs';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef


@Component({
  selector: 'app-report-product',
  templateUrl: './report-product.component.html',
  styleUrl: './report-product.component.css'
})
export class ReportProductComponent {
  selectedReport!: string;
  reports: string[] = ['Unsupported Item', 'Mistagged Item', 'Offensive Item', 'Spam'];
  userInfo: any;
  globalProduct: Product | null = null; // Initialize with null

  constructor(private dialogRef: MatDialogRef<ReportProductComponent>, private productService: ProductService,private httpClient: HttpClient, private userService: UserService) {}
  
  
  
  sendReport(): void {
    this.userService.sendReportEmail(this.selectedReport)
      .subscribe(
        response => {
          console.log('Email sent successfully');
          this.dialogRef.close(); // Close the dialog after sending the report

          // Add any further handling or UI updates here
        },
        error => {
          console.error('Error sending email:', error);
          // Handle error response or show error message
        }
      );
  }

  cancel(): void {
    this.dialogRef.close(); // Close the dialog without sending report
  }



    
  


  userId!: number;
  userUsername!: string;
  userProfilePic!: string;
  userFirstName!: string;
  userLastName!: string;
  userEmail!: string;

  userProfileInfo!: User;

  ngOnInit(): void {
    this.globalProduct = this.productService.getProductGlobally();

    if (this.globalProduct) {
      console.log('Global Product:', this.globalProduct);
      // You can now use this.globalProduct in your component's logic
    } else {
      console.log('No global product available.');
    }
    
    this.loadUserInfo();

  }

  loadUserInfo(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (this.userInfo && this.userInfo.userId) {
      this.userId = this.userInfo.userId;
      this.userUsername = this.userInfo.userUsername;
      this.userProfilePic = this.userInfo.userProfilePic;
      this.userFirstName = this.userInfo.userFirstName;
      this.userLastName = this.userInfo.userLastName;
      this.userEmail = this.userInfo.userEmail;
    } else {
      console.error('User information not found in local storage.');
    }
  }

}
