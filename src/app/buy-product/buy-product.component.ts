import { Component, ViewEncapsulation } from '@angular/core';
import {FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation, MatStepperModule} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { Address } from '../address';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { Guest } from '../guest';
import { Sale } from '../sale';
import { GuestService } from '../guest.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { Order } from '../order';
import { MatSnackBar } from '@angular/material/snack-bar';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrl: './buy-product.component.css',
  providers: [
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_FORMATS),
  ],

})
export class BuyProductComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{8}$')]);
  zipCode = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]);

  productTotatCost: number = 0;
  productSaleTotatCost: number = 0;
  product: Product | null = null;
  addressId!: number;
  userAddress: any;
  expiryDate = new FormControl(moment());

  isLinear = true;


  userId!: number;

  updatedUser: User = { userId: this.userId, userUsername: '', userFirstName: '', userLastName: '', userEmail: '', userPass: '', userPhoneNumber: 0, userBirthDate: new Date(), userBio: '', userProfilePic: '' };
  

  updatedUserCity!: string; // Assuming you have this variable

  cities: string[] = [
    "Tunis", "Sfax", "Sousse", "Ben Arous", "Gabes", "Kairouan", "Bizerte",
    "Djerba", "Nabeul", "Hammamet", "Monastir", "Gafsa", "Tozeur", "Mahdia",
    "Beja", "Jendouba", "Kasserine", "Medenine", "Tataouine", "La Manouba",
    "Siliana", "Zaghouan", "El Kef", "Ariana"
  ];
  
  updatedUserAddress: Address = { addressId: this.addressId, addressHint: '', addressHolder: '', addressUser: '', city: '', zipCode: 0 };
  isLoading: boolean = false;
  
  
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.expiryDate.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.expiryDate.setValue(ctrlValue);
    datepicker.close();
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = moment(control.value);
      const today = moment().startOf('day');
      return selectedDate.isAfter(today) ? null : { futureDate: true };
    };
  }
  

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter your email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  getZipCodeErrorMessage() {
    if (this.zipCode.hasError('required')) {
      return 'You must enter your city zip code';
    }

    return this.zipCode.hasError('zipCode') ? 'Not a valid zip code' : '';
  }

  getEmptyFieldErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter your email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPhoneNumberErrorMessage() {
    if (this.phoneNumber.hasError('required')) {
      return 'You must your phone number';
    }

    return this.phoneNumber.hasError('phoneNumber') ? 'Not a valid phone number' : '';
  }
  
  
  firstFormGroup = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    addressUser: ['', Validators.required],
    addressHint: ['', Validators.required],
    zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    city: ['', Validators.required, ]
  });
  
  secondFormGroup = this._formBuilder.group({
    paymentOption: ['1'], // Assuming the default payment option is credit card

    
    cardNumber: ['4111111111111111', Validators.required,],

    
    expiryDate: [moment(), Validators.required, ],
    
    
    securityCode: ['123', [Validators.required, this.securityCodeValidator()]],
    

  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],

  });
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private guestService: GuestService,
    private _snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private userService: UserService,
    private productService: ProductService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
  
  
  userOrder: Order = {
    orderProduct: 0,
    orderBuyer: undefined, // Adjust according to your requirements
    orderSeller: 0, // Adjust according to your requirements
    orderPrice: undefined, // Adjust according to your requirements
    orderProgress: '', // Add appropriate default value or adjust as needed
    orderDate: new Date(), // Add appropriate default value or adjust as needed
    orderProductName: '', // Add appropriate default value or adjust as needed
    orderSellerName: '', // Add appropriate default value or adjust as appropriate
    
  };



  userSale: Sale = {
    saleProduct: 0,
    saleBuyer: 0,
    saleSeller: 0, // Adjust according to your requirements
    salePayment: 0, // Adjust according to your requirements
    saleProgress: '', // Add appropriate default value or adjust as needed
    saleDate: new Date(), // Add appropriate default value or adjust as needed
    saleProductName: '', // Add appropriate default value or adjust as needed
    saleSellerName: '', // Add appropriate default value or adjust as appropriate
    
  };
  
  guestOrder: Guest = {
    guestFirstName: '',
    guestLastName: '',
    guestEmail: '',
    guestPhoneNumber: 0,
    guestCity: '',
    guestAddress: '',
    guestAddressHint: '',
    guestZipCode: 0,
    guestProduct: 0,
    guestOrderCost:0,
    
  }

  initializeUserOrder(): void {
    
    this.userOrder = {
      orderProduct: this.product?.productId || 0,
      orderBuyer: this.userId || 0,
      orderSeller: this.product?.productSeller || 0, // Adjust as needed
      orderPrice: this.productTotatCost || 0,
      orderProgress: '', // Add appropriate default value or adjust as needed
      orderDate: new Date(), // Add appropriate default value or adjust as needed
      orderProductName: '',
      orderSellerName: '',
    };
  }

  initializeUserSale(): void {
    this.userSale = {
      saleBuyer: this.userId || 0,
      saleProduct: this.product?.productId || 0,
      saleSeller: this.product?.productSeller || 0, // Adjust as needed
      salePayment: this.productSaleTotatCost || 0,
      saleProgress: '', // Add appropriate default value or adjust as needed
      saleDate: new Date(), // Add appropriate default value or adjust as needed
      saleProductName: '', // Add appropriate default value or adjust as needed
      saleSellerName: '', // Add appropriate default value or adjust as appropriate
    };
  }
  
  




  openSnackBar(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 5000, // Duration set to 5 seconds (5000 milliseconds)
    });
  }

  
  onSubmit(): void {
    const formData = new FormData();
    const saleFormData = new FormData();
    this.isLoading = true;

      console.log("the balall sjdkfljsdlf ",this.product!.productId)
      this.productService.setProductOnHold(this.product!.productId).subscribe(
        product => this.product = product,
        error => console.error('Error putting product on hold:', error)
      );
    
    
    

    if (!this.userId) {
      
      formData.append('guestFirstName', String(this.guestOrder.guestFirstName));
      formData.append('guestLastName', String(this.guestOrder.guestLastName));
      formData.append('guestEmail', String(this.guestOrder.guestEmail));
      formData.append('guestPhoneNumber', String(this.guestOrder.guestPhoneNumber));
      formData.append('guestCity', String(this.firstFormGroup.get('city')!.value));
      formData.append('guestAddress', String(this.guestOrder.guestAddress));
      formData.append('guestAddressHint', String(this.guestOrder.guestAddressHint));
      formData.append('guestZipCode', String(this.guestOrder.guestZipCode));
      formData.append('guestProduct', String(this.product?.productId));
      formData.append('guestOrderCost', String(this.productTotatCost))
      
      this.guestService.addGuestOrder(formData).subscribe((response) => {
        // Handle successful response here
        this.isLoading = false;
        this.openSnackBar('Thank you from buying from us!\n Our Stuff will contact you shortly');

      },
      (error) => {
        console.error('Error adding order', error);
        // Optionally, you can display an error message to the user
        this.isLoading = false;
      }
    );
    } else {
      formData.append('orderProduct', String(this.userOrder.orderProduct));
      formData.append('orderBuyer', String(this.userOrder.orderBuyer));
      formData.append('orderSeller', String(this.userOrder.orderSeller));
      formData.append('orderPrice', String(this.userOrder.orderPrice));
      console.log('the user order ',this.userOrder)

      saleFormData.append('saleProduct', String(this.userSale.saleProduct))
      saleFormData.append('saleBuyer',String(this.userSale.saleBuyer))
      saleFormData.append('saleSeller',String(this.userSale.saleSeller))
      saleFormData.append('salePayment', String(this.userSale.salePayment))
      console.log('the user sale',this.userSale)

      this.userService.addSale(saleFormData).subscribe(
        (response) => {
          console.log(saleFormData)
          console.log("sale added successfully")
        },
        (error) => {
          console.log("error", error);
        }
      )
  
      this.userService.addOrder(formData).subscribe(
        (response) => {
          // Handle successful response here
          this.isLoading = false;
          this.openSnackBar('Thank you from buying from us!');
  
        },
        (error) => {
          console.error('Error adding order', error);
          // Optionally, you can display an error message to the user
          this.isLoading = false;
        }
      );
      
    }


    this.updateUserAddress();
    this.updateUser();

    
  }

    

  
  
  ngOnInit(): void {





    this.expiryDate.setValidators(this.futureDateValidator());
    this.expiryDate.updateValueAndValidity();

    console.log("fsljsqdlkf")

    this.getAddressByHolder();
    
    this.product = this.productService.getProductGlobally();
    console.log('we found', this.product);
    this.productTotatCost = parseFloat(this.product!.productPrice) + 8;
    this.productSaleTotatCost = parseFloat(this.product!.productPrice) * 0.7;
    console.log('we found Seller', this.product!.productSeller);

    
    this.getUserInfo(this.userId)

    this.initializeUserOrder();
    this.initializeUserSale();
    
  }

  
  
  
  
  

  getUserAddress(addressId: number): void {
    console.log("Fight Or Be Forgotten for your address")
    console.log(this.addressId);
    this.httpClient.get<any>(`http://localhost:8034/restapi/address/${this.addressId}`).subscribe(
      (data) => {
        this.updatedUserAddress.addressUser = data.addressUser;
        this.updatedUserAddress.addressHint = data.addressHint;
        this.updatedUserAddress.addressHolder = data.addressHolder;
        this.updatedUserAddress.zipCode = data.zipCode;
        this.updatedUserAddress.city = data.city;
      },
      (error) => {
        console.error('Error fetching user address:', error);
      }
    );
  }

  
  updateUserAddress(): void {
    console.log('Updating user address', this.addressId);
    this.userService.updateUserAddress(this.addressId, this.updatedUserAddress).subscribe(
      (response) => {
        console.log('User Address updated successfully:', response);
        
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  

  getAddressByHolder() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo.userId;

    console.log('user id in buy product is ', userId);
    this.userService.getAddressByHolder(userId).subscribe(
      (address: Address) => { 
        if (address) { 
          this.userAddress = address;
          this.addressId = address.addressId;
          console.log(this.userAddress);
          console.log('User address ID:', address.addressId);
          console.log('Address found', this.addressId);
          this.getUserAddress(this.addressId);
          this.firstFormGroup.patchValue({
            city: address.city
          });

        } else {
          console.log('No address found for the user.');
        }
      },
      (error) => {
        console.error('Error fetching address:', error);
      }
    );
  }


  

  updateUser(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userId = userInfo.userId;

    this.userService.updateUser(this.userId, this.updatedUser).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  getUserInfo(userId: number): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userId = userInfo.userId;
    console.log('we are now in getUser info  and userId is ' + this.userId)
    this.httpClient.get<any>(`http://localhost:8034/restapi/user/${this.userId}`).subscribe(
      (data) => {
        this.updatedUser.userUsername = data.userUsername;
        
        this.updatedUser.userFirstName = data.userFirstName;
        this.updatedUser.userLastName = data.userLastName;
        this.updatedUser.userEmail = data.userEmail;
        //this.updatedUser.userPass = data.userPass;
        this.updatedUser.userBio = data.userBio;
        this.updatedUser.userPhoneNumber = data.userPhoneNumber;
        this.updatedUser.userBirthDate = data.userBirthDate;

        this.updatedUser.userProfilePic = data.userProfilePic;



      },
      (error) => {
        console.error('Error fetching user image:', error);
      }
    );
  }
  
  validateCardNumber() {
    const cardNumberControl = this.secondFormGroup.get('cardNumber');
    if (cardNumberControl && typeof cardNumberControl.value === 'string') {
      const value = cardNumberControl.value.replace(/\D/g, ''); // Remove non-digit characters
      if (value.length !== 16) {
        cardNumberControl.setErrors({ 'invalidCreditCardLength': true });
      } else {
        let sum = 0;
        let digit;
        let even = false;

        for (let i = value.length - 1; i >= 0; i--) {
          digit = parseInt(value.charAt(i), 10);

          if (even) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }

          sum += digit;
          even = !even;
        }

        if (sum % 10 !== 0) {
          cardNumberControl.setErrors({ 'invalidCreditCard': true });
        } else {
          cardNumberControl.setErrors(null); // Reset errors if valid
        }
      }
    }
  }

  onCardNumberInput(event: any) {
    const input = event.target.value;
    const inputWithDashes = input.replace(/\D/g, '') // Remove non-digit characters
      .replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4'); // Add dashes every four digits
    event.target.value = inputWithDashes;
    this.validateCardNumber(); // Trigger validation after filtering

  }
  

  securityCodeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const securityCode = control.value;
      // Implement your validation logic for security code here
      // For example, check if it contains only numbers and has a specific length
      const isValid = /^\d+$/.test(securityCode) && securityCode.length === 3; // Assuming security code should be 3 digits
      return isValid ? null : { invalidSecurityCode: true };
    };
  }
  
  onSecurityCodeInput(event: any) {
    const input = event.target.value;
    const numericInput = input.replace(/\D/g, ''); // Remove non-numeric characters
    event.target.value = numericInput;
    this.securityCodeValidator(); // Trigger validation after filtering
  }


  
  
}