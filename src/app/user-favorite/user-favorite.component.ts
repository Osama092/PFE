import { Component, input, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Order } from '../order';
import { UserInteractionService } from '../user-interaction.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Follow } from '../follow';
import { map, Observable } from 'rxjs';
import { Product } from '../product';

@Component({
  selector: 'app-user-favorite',
  templateUrl: './user-favorite.component.html',
  styleUrl: './user-favorite.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserFavoriteComponent {
  dataSource : Order[] = [];
  columnsToDisplay = ['orderDate', 'orderSeller', 'orderProduct', 'orderPrice', 'orderProgress'];
  salesColumnsToDisplay = ['orderDate', 'orderSeller', 'orderProduct', 'orderPrice', 'orderProgress'];

  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Order | null | undefined;
  
  isClicked: boolean = false;
  productSellerId!: number;

  constructor(private userInteractionService: UserInteractionService, private productService: ProductService, private datePipe: DatePipe, private route: ActivatedRoute, private userService: UserService) {}
 

  favorites: any[] | undefined;
  userId!: number;
  userUsername!: string;
  userProfilePic!: string;
  userBio!: string;
  userPhoneNumber!: number;
  userEmail!: string;
  userBirthDate!: string;

  followerCount!: number;
  followingCount!: number;
  productCount!: number;
  userFollower: Follow[] = [];
  userFollowing: Follow[] = [];
  userProfileInfo!: User;
  productsWithSellers: any[] = []; // Array to hold products with seller info


  ELEMENT_DATA: Order[] = [];


  followingUsers: Follow[] = []; // Array to store the users being followed by the current user

  ngOnInit(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userId = userInfo.userId;

    
    console.log('just checking')
    console.log('sdfkjlkqsdjfljdslfjkslqkjmflqsfjqdslm', this.userId);
    
    this.loadUserInfo();
    this.getUserInfo();
    this.getUserFavoriteProduct();


    
    
    

    this.userInteractionService.getCountOfFollowByFollower(this.userId).subscribe(
      count => {
        this.followerCount = count;
      },
      error => {
        console.error('Error fetching notification count:', error);
      }
    );

    this.userInteractionService.getCountOfFollowByFollowing(this.userId).subscribe(
      count => {
        this.followingCount = count;
      },
      error => {
        console.error('Error fetching notification count:', error);
      }
    );

    this.productService.getCountOfProductBySeller(this.userId).subscribe(
      count => {
        this.productCount = count;
      },
      error => {
        console.error('Error fetching notification count:', error);
      }
    );

    this.checkIfFollowing();


    this.fetchFollowers()
    this.fetchFollowings()


  }

  
  

  loadUserInfo(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.userId) {
      this.userId = userInfo.userId;
      this.userUsername = userInfo.userUsername;
      this.userProfilePic = userInfo.userProfilePic;
      this.userBio = userInfo.userBio;
      this.userPhoneNumber = userInfo.userPhoneNumber;
      this.userEmail = userInfo.userEmail;
      this.userBirthDate = this.formatBirthDate(userInfo.userBirthDate);

      console.log(userInfo)
      console.log('userId', userInfo.userId);
      console.log('user birthdate', userInfo.userBirthDate)
    } else {
      // Handle the case where userInfo is not available/found
      console.error('User information not found in local storage.');
    }
  }

  isFollowing = false;

  
  
  
  

  @ViewChild('followersMenu') followersMenu!: MatMenuTrigger;

  
  products: Product[] = []; // Assuming Product model is used


  private getUserFavoriteProduct() {
    this.userInteractionService.getFavoriteByUser(this.userId).subscribe(
      (favoriteProducts: any[]) => {
        favoriteProducts.forEach(favoriteProduct => {
          const productId = favoriteProduct.favoriteProduct;
          // Fetch product details
          this.productService.getProductById(productId).subscribe(
            (product: Product) => {
              const sellerId = product.productSeller! ;
              // Fetch seller's user profile
              this.userService.getUserById(sellerId).subscribe(
                (seller: User) => {
                  // Create a new object with product and seller info
                  const productWithSeller = {
                    product: product,
                    seller: seller
                  };
                  // Push the combined object into productsWithSellers array
                  this.productsWithSellers.push(productWithSeller);
                },
                (error) => {
                  console.error(`Error fetching seller with ID ${sellerId}:`, error);
                }
              );
            },
            (error) => {
              console.error(`Error fetching product with ID ${productId}:`, error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching favorite products:', error);
      }
    );
  }

  private getFollowing() {
    this.userInteractionService.getFollowByFollowing(this.userId).subscribe(
      (following: Follow[]) => {
        this.userFollower = following;
      },
      (error) => {
        console.error('Error fetching products:', error);

      }
    );
  }

  private getFollower() {
    this.userInteractionService.getFollowByFollowing(this.userId).subscribe(
      (follower: Follow[]) => {
        this.userFollowing = follower;

      },
      (error) => {
        console.error('Error fetching products:', error);

      }
    );
  }
  
  private getUserInfo() {

    this.userService.getUserById(this.userId).subscribe(
      user => {
        this.userProfileInfo = {
          userId: user.userId,
          userUsername: user.userUsername,
          userFirstName: user.userFirstName,
          userLastName: user.userLastName,
          userEmail: user.userEmail,
          userPhoneNumber: user.userPhoneNumber,
          userProfilePic: 'data:image/png;base64,'+ user.userProfilePic,
          userPass: user.userPass,
          userBio: user.userBio,
          userBirthDate: user.userBirthDate
        };;
 
      }, (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }
  
  

  toggleHeart() {
    this.isClicked = !this.isClicked;
  }

  private formatBirthDate(birthDate: string): string {
    const formattedDate = this.datePipe.transform(birthDate, 'dd/MM/yyyy');
    return formattedDate || ''; // Return empty string if formatting fails
  }

  followUser() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const formData = new FormData();
    
    formData.append('followerId', userInfo.userId.toString());
    formData.append('followingId', this.productSellerId.toString());
  
    this.userInteractionService.addFollow(formData).subscribe(
      (response) => {
        console.log('Follow done', response);
        this.isFollowing = true;
      },
      (error) => {
        console.error('Error Following this user ', error);
      }
    );
  }

  checkIfFollowing() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (!userInfo.userId) {
      console.error('User information not found in local storage.');
      return;
    }

    const followerId = userInfo.userId;
    const followingId = this.productSellerId;

    this.userInteractionService.checkIfFollowing(followerId, followingId).subscribe(
      (isFollowing: boolean) => {
        this.isFollowing = isFollowing;
      },
      (error) => {
        console.error('Error checking if following:', error);
      }
    );
  }
  
  
  

  

  
  unfollowUser() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const followerId = userInfo.userId;
    const followingId = this.productSellerId;

    this.userInteractionService.unfollowUser(followerId, followingId).subscribe(
      () => {
        console.log('Unfollowed successfully');
        this.isFollowing = false;
      },
      (error) => {
        console.error('Error unfollowing user:', error);
      }
    );
  }
  

  
  
  toggleFollow() {
    if (this.isFollowing) {
      this.unfollowUser(); // Call the unfollow method if already following
    } else {
      this.followUser(); // Call the follow method if not following
    }
  }
  
  userFollowers: Follow[] = [];
  followerInfo: User[] = [];

  fetchFollowers(): void {
    this.userInteractionService.getFollowByFollowing(this.productSellerId).subscribe(
      followers => {
        for (const userFollower of followers) { // Iterate over the 'followers' array
          this.userService.getUserById(userFollower.followerId).subscribe(
            user => {
              this.followerInfo.push(user);
            },
            error => {
              console.error('Error getting user info:', error);
            }
          );
        }
      },
      error => {
        console.error('Error fetching followers:', error);
      }
    );
  }
  

  userFollowings: Follow[] = [];
  followingInfo: User[] = [];

  fetchFollowings(): void {
    this.userInteractionService.getFollowByFollower(this.userId).subscribe(
      followings => {
        for (const userFollowing of followings) { // Iterate over the 'followers' array
          this.userService.getUserById(userFollowing.followingId).subscribe(
            user => {
              this.followingInfo.push(user);
            },
            error => {
              console.error('Error getting user info:', error);
            }
          );
        }
      },
      error => {
        console.error('Error fetching followers:', error);
      }
    );
  }

  heartClicked(product: any) {
    product.isClicked = !product.isClicked; // Toggle the click state for the specific product

    
    }

  



}
