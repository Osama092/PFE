import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  userUsername!: string;
  userEmail!: string;
  message!: string;


  constructor(private userService: UserService, private _snackBar: MatSnackBar) { }

  


  sendEmail() {
    
      this.userService.sendContactEmail(this.userUsername, this.userEmail, this.message)
      .subscribe(response => {
        console.log('Email sent successfully:', response);
        this._snackBar.open('Email sent successfully', 'Close', {
          duration: 3000, // Duration the snack bar should be shown (in milliseconds)
        });
      }, error => {
        if (error.status === 200) {
          console.log('Email sent successfully:', error.error); // Log the successful response
          this._snackBar.open('Thank you for contacting us we will reach you shortly', 'Close', {
            duration: 3000, // Duration the snack bar should be shown (in milliseconds)
          });
        } else {
          console.error('Failed to send email:', error);
          // Handle error
        }
      });
    

    
  }

  

  getSeverity(status: string) {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'danger';
      default:
        return 'warning';
    }
  }

  customers = [
    {
      representative: { name: 'Whats is BridgeWear' },
      phrase: 'This is a test phrase.'
    },
    {
      representative: { name: 'How BridgeWear Works' },
      phrase: 'Another example of text.'
    },
    {
      representative: { name: 'How i receie my money' },
      phrase: 'Yet another sample phrase.'
    },
    {
      representative: { name: 'How i send my product?' },
      phrase: 'Another example of text.'
    },
    {
      representative: { name: 'Can i refund?' },
      phrase: 'Another example of text.'
    },
    {
      representative: { name: 'How i cancel my order?' },
      phrase: 'Another example of text.'
    },
    {
      representative: { name: 'How i delete my account' },
      phrase: 'Another example of text.'
    },

  ];

  calculateCustomerTotal(representativeName: string) {
    return this.customers.filter(customer => customer.representative.name === representativeName).length;
  }

  
  
  
  
  
  
  
  

}
