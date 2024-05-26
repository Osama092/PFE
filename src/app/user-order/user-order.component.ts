import { Component, ViewChild } from '@angular/core';
import { User } from '../user';
import { Order } from '../order';
import { UserService } from '../user.service';
import { ProductService } from '../product.service';
import { DatePipe } from '@angular/common';
import { Sale } from '../sale';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Product } from '../product';
import { Router } from '@angular/router';
import { Follow } from '../follow';
import { UserInteractionService } from '../user-interaction.service';
import { MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrl: './user-order.component.css',
  
  
})
export class UserOrderComponent {

  userFollowings: Follow[] = [];
  followingInfo: User[] = [];
  orderDataSource: Order[] = [];

  saleDataSource: Sale[] = [];
  productCount!: number;
  
  orderColumnsToDisplay = ['orderDate', 'orderSellerName', 'orderProductName', 'orderPrice', 'orderProgress'];
  saleColumnsToDisplay = ['saleDate', 'saleProductName', 'salePayment', 'saleDeliveryNum', 'saleProgress'];

  

  isFollowing = false;
  @ViewChild('followersMenu') followersMenu!: MatMenuTrigger;

  products: any[] | undefined;
  orderCount!: number;

  userId!: number;
  userUsername!: string;
  userProfilePic!: string;
  userBio!: string;
  userPhoneNumber!: number;
  userEmail!: string;
  userBirthDate!: string;

  orderProductId!: number;
  orderSellerId!: number;
  saleProductId!: number;
  orderProductTable!: Product;
  orderSellerTable!: User;

  userProfileInfo!: User;
  productSellerId!: number;
  orderProducts: any[] = [];


  followingUsers: Follow[] = [];
  userFollower: Follow[] = [];
  userFollowing: Follow[] = [];
  followerCount!: number;
  followingCount!: number;

  

  constructor(private userInteractionService: UserInteractionService,private router: Router, private productService: ProductService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private userService: UserService) {}




  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.productSellerId = params['productSellerId'];
    });

    this.getUserInfo();
    this.loadUserInfo();
    this.fetchOrderByBuyer()
    this.fetchProductCountBySeller()
    console.log(' blablab ', this.userId)

    
    
      
    this.fetchSaleBySeller()

    this.fetchFollowingCount();
    this.fetchFollowerCount();

    this.checkIfFollowing();

    this.fetchFollowers()
    this.fetchFollowings()
    
  
  }

  fetchOrderByBuyer(): void {
    this.userService.getOrderByBuyer(this.userId).subscribe(data => {
      if (Array.isArray(data)) {
        this.orderDataSource = data;
        console.log("order date is");
        console.log(this.orderDataSource);
  
        for (let i = 0; i < this.orderDataSource.length; i++) {
          const orderProductId = this.orderDataSource[i].orderProduct;
          const orderSellerId = this.orderDataSource[i].orderSeller;
  
          this.userService.getUserById(orderSellerId).subscribe((user: User) => {
            console.log('herer we go here');
            console.log(user.userUsername);
            const sellerName = user.userUsername;
            this.orderDataSource[i].orderSellerName = sellerName;
          });
  
          this.productService.getProductById(orderProductId).subscribe((product: Product) => {
            const productName = product.productName;
            this.orderDataSource[i].orderProductName = productName;
          });
        }
      } else {
        this.orderDataSource = [data];
      }
    });
  }

  fetchProductCountBySeller(): void {
    this.productService.getCountOfProductBySeller(this.productSellerId).subscribe(
      count => {
        this.productCount = count;
      },
      error => {
        console.error('Error fetching notification count:', error);
      }
    );
  }

  fetchSaleBySeller(): void {
    this.userService.getSaleBySeller(this.userId).subscribe(data => {
      if (Array.isArray(data)) {
        this.saleDataSource = data;
        console.log("date is");
        console.log(this.saleDataSource);
  
        for (let i = 0; i < this.saleDataSource.length; i++) {
          const saleProductId = this.saleDataSource[i].saleProduct;
          this.productService.getProductById(saleProductId).subscribe((product: Product) => {
            const productName = product.productName;
            this.saleDataSource[i].saleProductName = productName;
          });
        }
      } else {
        this.saleDataSource = [data];
      }
  
      if (this.saleDataSource.length > 0) {
        this.saleProductId = this.saleDataSource[0].saleProduct;
        console.log("Product Id is ", this.saleProductId);
  
        this.productService.getProductById(this.saleProductId).subscribe((product: Product) => {
          console.log("product isdidid", this.saleProductId);
        });
      } else {
        console.log("no order found");
      }
    });
  }

  fetchFollowingCount(): void {
    this.userInteractionService.getCountOfFollowByFollower(this.productSellerId).subscribe(
      count => {
        this.followingCount = count;
        console.log(this.followerCount);
      },
      error => {
        console.error('Error fetching followers count:', error);
      }
    );
  }

  getOrderColumnTitle(column: string): string {
    // Map column names to their corresponding titles
    switch (column) {
      case 'orderDate':
        return 'Order Date';
      case 'orderSellerName':
        return 'Seller';
      case 'orderProductName':
        return 'Product';
      case 'orderPrice':
        return 'Price';
      case 'orderProgress':
        return 'Order Progress';
      default:
        return '';
    }
  }
  
  

  getSaleColumnTitle(column: string): string {
    // Map column names to their corresponding titles
    switch (column) {
      case 'saleDate':
        return 'Sale Date';
      case 'saleProductName':
        return 'Product Name';
      case 'salePayment':
        return 'Payment';
      case 'saleDeliveryNum':
        return 'Sale Number';
      case 'saleProgress':
        return 'Sale Progress';
      default:
        return '';
    }
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

  private getUserInfo() {
    this.userService.getUserById(this.productSellerId).subscribe(
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

  private formatBirthDate(birthDate: string): string {
    const formattedDate = this.datePipe.transform(birthDate, 'dd/MM/yyyy');
    return formattedDate || ''; // Return empty string if formatting fails
  }

  
  private fetchOrderSeller(userId: number): void {
    this.userService.getUserById(userId).subscribe((user: User) => {
      this.orderSellerTable = user;
      console.log('OrderSeller:', this.orderSellerTable);
    },
      (error) => {
        console.log('Error loading orderSeller:', error);
      }
    );
  }

  
  logOrderProductId(order: Order) {
    
    this.router.navigate(['/product-detail', order.orderProduct]);
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
  
  fetchFollowerCount(): void {
    this.userInteractionService.getCountOfFollowByFollowing(this.productSellerId).subscribe(
      count => {
        this.followerCount = count;
        console.log(this.followingCount);
      },
      error => {
        console.error('Error fetching notification count:', error);
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

  fetchFollower(): void{
    this.userInteractionService.getFollowByFollowing(this.productSellerId).subscribe(
      
    );
  }

  fetchFollowers(): void {
    this.userInteractionService.getFollowByFollowing(this.productSellerId).subscribe(
      followers => {
        for (const userFollower of followers) {
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
  


  fetchFollowings(): void {
    this.userInteractionService.getFollowByFollower(this.productSellerId).subscribe(
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



}

