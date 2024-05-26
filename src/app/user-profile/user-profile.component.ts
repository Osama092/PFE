import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';
import { UserInteractionService } from '../user-interaction.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Follow } from '../follow';
import { Product } from '../product';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  @ViewChild('followersMenu') followersMenu!: MatMenuTrigger;



  soldProducts: Product[] = [];
  saleProducts: Product[] = [];

  
  isClicked = false;
  isFollowing = false;
  productSellerId!: number;
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
  userProfileInfo!: User;
  products: any[] | undefined;
  userFollower: Follow[] = [];
  userFollowing: Follow[] = [];
  userFollowers: Follow[] = [];
  followerInfo: User[] = [];
  userFollowings: Follow[] = [];
  followingInfo: User[] = [];

  constructor(
    private userInteractionService: UserInteractionService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productSellerId = params['productSellerId'];
    });
    
    this.loadUserInfo();
    this.getUserInfo();
    this.getSellerProduct();

    this.fetchFollowCounts();
    this.checkIfFollowing();
    this.fetchFollowers();
    this.fetchFollowings();
    this.getSoldSellerProduct()
  }

  private loadUserInfo(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.userId) {
      this.userId = userInfo.userId;
      this.userUsername = userInfo.userUsername;
      this.userProfilePic = userInfo.userProfilePic;
      this.userBio = userInfo.userBio;
      this.userPhoneNumber = userInfo.userPhoneNumber;
      this.userEmail = userInfo.userEmail;
      //this.userBirthDate = this.formatBirthDate(userInfo.userBirthDate);
      this.userBirthDate = userInfo.userBirthDate
    } else {
      console.error('User information not found in local storage.');
    }
  }

  private getSellerProduct(): void {
    this.productService.getProductBySeller(this.productSellerId).subscribe(
      products => {

        this.saleProducts = products.filter((product: { productTag: string; }) => product.productTag === 'onSale');
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  private getSoldSellerProduct(): void {
    this.productService.getProductBySeller(this.productSellerId).subscribe(
      products => {
        console.log('////////////////////////////////////////')
        
        this.soldProducts = products.filter((product: { productTag: string; }) => product.productTag === 'onSold');
        console.log(this.soldProducts);

      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  
  

  private getUserInfo(): void {
    this.userService.getUserById(this.productSellerId).subscribe(
      user => {
        this.userProfileInfo = {
          userId: user.userId,
          userUsername: user.userUsername,
          userFirstName: user.userFirstName,
          userLastName: user.userLastName,
          userEmail: user.userEmail,
          userPhoneNumber: user.userPhoneNumber,
          userProfilePic: 'data:image/png;base64,' + user.userProfilePic,
          userPass: user.userPass,
          userBio: user.userBio,
          userBirthDate: user.userBirthDate
        };
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
  }



  private fetchFollowCounts(): void {
    this.userInteractionService.getCountOfFollowByFollower(this.productSellerId).subscribe(
      count => {
        this.followingCount = count;
      },
      error => {
        console.error('Error fetching following count:', error);
      }
    );

    this.userInteractionService.getCountOfFollowByFollowing(this.productSellerId).subscribe(
      count => {
        this.followerCount = count;
      },
      error => {
        console.error('Error fetching follower count:', error);
      }
    );

    this.productService.getCountOfProductBySeller(this.productSellerId).subscribe(
      count => {
        this.productCount = count;
      },
      error => {
        console.error('Error fetching product count:', error);
      }
    );
  }

  private checkIfFollowing(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.userId) {
      console.error('User information not found in local storage.');
      return;
    }

    const followerId = userInfo.userId;
    const followingId = this.productSellerId;

    this.userInteractionService.checkIfFollowing(followerId, followingId).subscribe(
      isFollowing => {
        this.isFollowing = isFollowing;
      },
      error => {
        console.error('Error checking if following:', error);
      }
    );
  }

  private fetchFollowers(): void {
    this.userInteractionService.getFollowByFollowing(this.productSellerId).subscribe(
      followers => {
        followers.forEach(userFollower => {
          this.userService.getUserById(userFollower.followerId).subscribe(
            user => {
              this.followerInfo.push(user);
            },
            error => {
              console.error('Error getting user info:', error);
            }
          );
        });
      },
      error => {
        console.error('Error fetching followers:', error);
      }
    );
  }

  private fetchFollowings(): void {
    this.userInteractionService.getFollowByFollower(this.productSellerId).subscribe(
      followings => {
        followings.forEach(userFollowing => {
          this.userService.getUserById(userFollowing.followingId).subscribe(
            user => {
              this.followingInfo.push(user);
            },
            error => {
              console.error('Error getting user info:', error);
            }
          );
        });
      },
      error => {
        console.error('Error fetching followings:', error);
      }
    );
  }
/*
  private formatBirthDate(birthDate: string): string {
    const formattedDate = this.datePipe.transform(birthDate, 'dd/MM/yyyy');
    return formattedDate || ''; // Return empty string if formatting fails
  }
*/


  toggleFollow(): void {
    if (this.isFollowing) {
      this.unfollowUser();
    } else {
      this.followUser();
    }
  }

  private followUser(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const formData = new FormData();
    formData.append('followerId', userInfo.userId.toString());
    formData.append('followingId', this.productSellerId.toString());

    this.userInteractionService.addFollow(formData).subscribe(
      response => {
        this.isFollowing = true;
      },
      error => {
        console.error('Error following user:', error);
      }
    );
  }

  private unfollowUser(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const followerId = userInfo.userId;
    const followingId = this.productSellerId;

    this.userInteractionService.unfollowUser(followerId, followingId).subscribe(
      () => {
        this.isFollowing = false;
      },
      error => {
        console.error('Error unfollowing user:', error);
      }
    );
  }


}
