import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent {

  constructor(private http: HttpClient, private userService: UserService, private route: ActivatedRoute) {}
  
  tryd: string = '';
  userimg: string = '';
  userus: string = '';
  defaultPassword: string = '';

  userPictureFile: File | null = null;
  showPassword: boolean = false;
  updatedUser: User = { userId: this.route.snapshot.params['userId'], userUsername: '', userFirstName: '', userLastName: '', userEmail: '', userPass: '', userPhoneNumber: 0, userBirthDate: new Date(), userBio: '', userProfilePic: '' };

  ngOnInit() {
      this.updatedUser.userBirthDate = new Date();

    this.http.get<any>(`http://localhost:8034/restapi/user/${this.updatedUser.userId}`).subscribe(
      (data) => {
        this.updatedUser.userUsername = data.userUsername;
        this.userus = data.userUsername;
        console.log(this.userus);

        this.updatedUser.userFirstName = data.userFirstName;
        this.updatedUser.userLastName = data.userLastName;
        this.updatedUser.userEmail = data.userEmail;
        
        this.defaultPassword = data.userPass;
        this.updatedUser.userBio = data.userBio;
        this.updatedUser.userPhoneNumber =  data.userPhoneNumber;
        this.updatedUser.userBirthDate = new Date(data.userBirthDate);
        console.log('hellsid fjsdlq', data.userBirthDate)
        this.updatedUser.userProfilePic =  data.userProfilePic;
        this.userimg = "data:image/jpg;base64," + this.updatedUser.userProfilePic;

        console.log(this.updatedUser.userProfilePic);


      },
      (error) => {
        console.error('Error fetching user image:', error);
      }
    );
  }

  updateUser(): void {
    this.updatedUser.userPass = this.updatedUser.userPass.trim();
    if (!this.updatedUser.userPass) {
      this.updatedUser.userPass = this.defaultPassword;
    }
    this.userService.updateUser(this.updatedUser.userId, this.updatedUser).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        console.log('and his birth date is', response.userBirthDate)
        window.location.reload();
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userPictureFile = file;
      this.readImage(file);
      // Convert the selected file to base64
      this.convertFileToBase64(file);
    }
  }



  private convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {

      this.userPictureFile = file;


      this.updatedUser.userProfilePic = reader.result as string;
      console.log("updatedUser")
      this.userimg = "";
      this.tryd = this.updatedUser.userProfilePic;
      console.log("tryd************************************************************************************")

      console.log(this.updatedUser.userProfilePic);

      // Remove the prefix from userProfilePic
      const [, updatedUserProfilePic] = this.updatedUser.userProfilePic.split(',');
      this.updatedUser.userProfilePic = updatedUserProfilePic;

      console.log(updatedUserProfilePic);
      this.updatedUser.userProfilePic = updatedUserProfilePic;

    };
    reader.readAsDataURL(file);
  }
  
  

  

readImage(file: File): void {
	const reader = new FileReader();

	reader.onload = () => {
		this.updatedUser.userProfilePic = reader.result as string;
	};

	reader.readAsDataURL(file);
  }
  


showEmailWarning: boolean = false;
showPhoneNumberWarning: boolean = false;
showFirstNameWarning: boolean = false;
showLastNameWarning: boolean = false;
showuserUsernameWarning: boolean = false;


validateUsername() {
    const usernamePattern = /[a-zA-Z]+/;
    this.showuserUsernameWarning = !usernamePattern.test(this.updatedUser.userUsername);

}

  validateFirstName() {
    const firstNamePattern = /[a-zA-Z]+/;
    this.showFirstNameWarning = !firstNamePattern.test(this.updatedUser.userFirstName);

  }
  validateLastName() {
    const lastNamePattern = /[a-zA-Z]+/;
    this.showLastNameWarning = !lastNamePattern.test(this.updatedUser.userLastName);

  }

  validateEmail() {
    const emailPattern = /.+@.+?\..+/;

    this.showEmailWarning = !emailPattern.test(this.updatedUser.userEmail);
  }

  validatePhoneNumber() {
    const phoneNumberPattern = /^\d{8}$/;
    this.showPhoneNumberWarning = !phoneNumberPattern.test(this.updatedUser.userPhoneNumber.toString());
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validatePassword() {
    const passwordPattern =  /^(?=.*[A-Z])(?=.*\d)(?=.*[\{\}!@#$%^&*()-_+=|\\[\]{};:'"<>,.?\/])[A-Za-z\d\{\}!@#$%^&*()-_+=|\\[\]{};:'"<>,.?\/]{8,}$/;
    this.showPasswordWarning = !passwordPattern.test(this.updatedUser.userPass);
  }


  showPasswordWarning: boolean = false;

  
  
}
