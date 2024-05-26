import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BuyProductComponent } from './buy-product/buy-product.component';
import { UserOrderComponent } from './user-order/user-order.component';
import { UserFavoriteComponent } from './user-favorite/user-favorite.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';

const routes: Routes = [

  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-edit/:userId', component: UserEditComponent },
  { path: 'reset-password/:userId', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'product-detail/:productId', component: ProductDetailComponent },
  { path: 'add-product/:userId', component: AddProductComponent },
  { path: 'product-filter', component: ProductFilterComponent },
  { path: 'edit-product/:productId', component: EditProductComponent },
  { path: 'user-profile/:productSellerId', component: UserProfileComponent },
  { path: 'user-order/:productSellerId', component: UserOrderComponent },
  { path: 'user-favorite/:userId', component: UserFavoriteComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us', component: AboutUsComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
