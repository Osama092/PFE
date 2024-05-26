import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FacebookLoginProvider, SocialAuthService, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import {  MatStepperModule} from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { AsyncPipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AddProductComponent } from './add-product/add-product.component';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DatePipe } from '@angular/common';
import { BuyProductComponent } from './buy-product/buy-product.component';
import { ReportProductComponent } from './report-product/report-product.component';

import { MatRadioButton } from '@angular/material/radio';
import { MatMenuTrigger } from '@angular/material/menu';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import {MatTableModule} from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserOrderComponent } from './user-order/user-order.component';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { ProductShareComponent } from './product-share/product-share.component';
import { UserFavoriteComponent } from './user-favorite/user-favorite.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CarouselModule } from 'primeng/carousel';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { PasswordModule } from 'primeng/password';

import { DividerModule } from 'primeng/divider';

import { InputTextModule } from 'primeng/inputtext';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';  // Import RouterModule


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQj6dMzq0q6KWw3fBIMGwPAXPfEg_zq-E",
  authDomain: "front-bw.firebaseapp.com",
  projectId: "front-bw",
  storageBucket: "front-bw.appspot.com",
  messagingSenderId: "828687088809",
  appId: "1:828687088809:web:0ea308bf421b79b161bdb8",
  measurementId: "G-H77NMF4JLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserEditComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    HomeComponent,
    ProductDetailComponent,
    NavBarComponent,
    AddProductComponent,
    ProductFilterComponent,
    EditProductComponent,
    UserProfileComponent,
    BuyProductComponent,
    ReportProductComponent,
    UserOrderComponent,
    CommentSectionComponent,
    ProductShareComponent,
    UserFavoriteComponent,
    LandingPageComponent,
    ContactUsComponent,
    AboutUsComponent,
    
    


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    NgbModule,
    NgbCarouselModule,
    SocialLoginModule,
    MatSliderModule,
    MatMenuModule,
    MatTabsModule,
    MatExpansionModule,
    FontAwesomeModule,
    MatAccordion,
    MatBadgeModule,
    MatListModule,
    MatStepperModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatTableModule,
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarLabel,
    ShareButtonsModule,
    ShareIconsModule,
    MatRadioButton,
    ShareButtonsModule,
    ShareIconsModule,
    MatMenuTrigger,
    CarouselModule,
    MdbCarouselModule,
    PasswordModule,
    DividerModule,
    InputTextModule,
    TableModule,
    TagModule,
    ButtonModule,
    RouterModule


    
    
    
    
    
    
    
    
    
    
    


    
  ],
  providers: [
  
    
  
    {
       
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('781965070452776')
          }
          
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    
    DatePipe, provideNativeDateAdapter(),
    
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
