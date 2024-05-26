import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { UserInteractionService } from '../user-interaction.service';
import { Notification } from '../notification';
import { DatePipe } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  imageUrl = './assets/logolarge.svg';
  userPic: string = '';
  tempuserid!: number;
  cartItemCount: number = 0;
  notificationItemCount: number = 0;
  userId!: number;

  notifications: { [key: string]: Notification[] } = {
    COMMENT: [],
    FOLLOW: [],
    LIKE: []
  };

  constructor(
    private authService: AuthService, 
    private datePipe: DatePipe, 
    private userInteractionService: UserInteractionService, 
    private httpClient: HttpClient, 
    private route: ActivatedRoute, 
    private router: Router, 
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      this.userId = userInfo.userId;
      console.log('the user id  is',this.userId)

      this.fetchCartItemCount();
      this.fetchNotificationItemCount();
      this.fetchUserDataAndNotifications();
    });
  }

  private fetchCartItemCount(): void {
    this.userService.getCountOfOrdersByBuyer(this.userId).subscribe(
      count => {
        this.cartItemCount = count;
      },
      error => {
        console.error('Error fetching order count:', error);
      }
    );
  }

  private fetchNotificationItemCount(): void {
    this.userInteractionService.getCountOfNotificationByReceiver(this.userId).subscribe(
      count => {
        this.notificationItemCount = count;
      },
      error => {
        console.error('Error fetching notification count:', error);
      }
    );
  }

  private fetchUserDataAndNotifications(): void {
    this.httpClient.get<any>(`http://localhost:8034/restapi/user/${this.userId}`).subscribe(
      data => {
        this.userPic = data.userProfilePic;
        this.fetchAndFilterNotifications();
      },
      error => {
        console.error('Error fetching user image:', error);
      }
    );
  }

  private fetchAndFilterNotifications(): void {
    this.userInteractionService.getNotificationsByReceiver(this.userId).subscribe(
      filteredNotifications => {
        this.notifications = filteredNotifications;
        this.populateSenderDetails();
      },
      error => {
        console.error('Error fetching and filtering notifications:', error);
      }
    );
  }

  private populateSenderDetails(): void {
    Object.values(this.notifications).forEach((notificationArray: Notification[]) => {
      notificationArray.forEach((notification: Notification) => {
        this.userService.getUserById(notification.notificationSender).subscribe(
          user => {
            notification.senderDetails = user;
          },
          error => {
            console.error('Error fetching user details:', error);
          }
        );
      });
    });
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  goToUserEditPage() {
    this.router.navigate(['/user-edit', this.userId]);
  }

  goToUserProfilePage() {
    this.router.navigate(['/user-profile', this.userId]);
  }

  goToLoginPage() {
    this.authService.logout();
  }

  goToOrderPage() {
    this.router.navigate(['/user-order', this.userId]);
  }

  goToUserFavoriteProductPage() {
    this.router.navigate(['/user-favorite', this.userId]);
  }

  removeNotification(notification: any) {
    notification.clicked = true;
    console.log(notification.notificationSender);

    switch (notification.notificationType) {
      case 'COMMENT':
      case 'LIKE':
        this.router.navigate(['/product-detail', notification.notificationProduct]);
        break;
      case 'FOLLOW':
        this.router.navigate(['/user-profile', notification.notificationSender]);
        break;
      default:
        break;
    }
  }
}
