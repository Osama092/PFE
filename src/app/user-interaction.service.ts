import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './comment';
import { Favorite } from './favorite';
import { Notification } from './notification';
import { map, Observable } from 'rxjs';
import { Follow } from './follow';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {

  constructor(private httpClient: HttpClient) { }

  private commentBaseUrl = "http://localhost:8034/restapi/comment";
  private favoriteBaseUrl = "http://localhost:8034/restapi/favorite";
  private notificationBaseUrl = "http://localhost:8034/restapi/notification";
  private followBaseUrl = "http://localhost:8034/restapi/follow";




  getUserComment(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.commentBaseUrl}`);

  }
  getCommentByProduct(commentProduct: number): Observable<any[]> {
    const url = `${this.commentBaseUrl}/getCommentProduct/${commentProduct}`;
    return this.httpClient.get<any[]>(url);
  }

  addComment(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.commentBaseUrl}/addComment`, formData);
  }

  


  getCommentById(commentId: number): Observable<Comment> {
    const url = `${this.commentBaseUrl}/${commentId}`;
    return this.httpClient.get<Comment>(url);
  }

  updateComment(commentId: number, commentContent: string): Observable<any> {
    const url = `${this.commentBaseUrl}/${commentId}`;
    return this.httpClient.put(url, { commentContent });
  }

  

  deleteCommentById(commentId: number): Observable<any> {
    const url = `${this.commentBaseUrl}/${commentId}`;

    return this.httpClient.delete(url);
  }

  //Follows

  addFollow(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.followBaseUrl}/addFollow`, formData);
  }

  getFollowByFollower(followerId: number): Observable<Follow[]> {
    const url = `${this.followBaseUrl}/findByFollowerId/${followerId}`;
    return this.httpClient.get<any[]>(url);
  }

  getFollowByFollowing(followingId: number): Observable<Follow[]> {
    const url = `${this.followBaseUrl}/findByFollowingId/${followingId}`;
    return this.httpClient.get<any[]>(url);
  }

  getCountOfFollowByFollower(followerId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.followBaseUrl}/countFollower/${followerId}`);
  }
  
  getCountOfFollowByFollowing(followingId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.followBaseUrl}/countFollowing/${followingId}`);
  }

  checkIfFollowing(followerId: number, followingId: number): Observable<boolean> {
    const params = new HttpParams()
      .set('followerId', followerId.toString())
      .set('followingId', followingId.toString());

    return this.httpClient.get<boolean>(`${this.followBaseUrl}/checkIfFollowing`, { params });
  }

  unfollowUser(followerId: number, followingId: number): Observable<any> {
    return this.httpClient.delete(`${this.followBaseUrl}/unfollowUser?followerId=${followerId}&followingId=${followingId}`);
  }



 
  //favorite 

  getUserFavorite(): Observable<Favorite[]> {
    return this.httpClient.get<Favorite[]>(`${this.favoriteBaseUrl}`);

  }

  addFavorite(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.favoriteBaseUrl}/addFavorite`, formData);
  }

  getFavoritetById(favoriteId: number): Observable<Favorite> {
    const url = `${this.favoriteBaseUrl}/${favoriteId}`;
    return this.httpClient.get<Favorite>(url);
  }

  getFavoriteByUser(favoriteUser: number): Observable<any[]> {
    const url = `${this.favoriteBaseUrl}/getFavoriteUser/${favoriteUser}`;
    return this.httpClient.get<any[]>(url);
  }

  getCountOfFavoritesByProduct(favoirteProduct: number): Observable<number> {
    return this.httpClient.get<number>(`${this.favoriteBaseUrl}/count/${favoirteProduct}`);
  }

  deleteFavoriteById(favoriteId: number): Observable<any> {
    const url = `${this.favoriteBaseUrl}/${favoriteId}`;
    return this.httpClient.delete(url);
  }

  //notification

  getUserNotification(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`${this.notificationBaseUrl}`);

  }

  getNotificationByUser(notificationUser: number): Observable<any[]> {
    const url = `${this.notificationBaseUrl}/getNotificationUser/${notificationUser}`;
    return this.httpClient.get<any[]>(url);
  }

  gettNotificationById(notificationId: number): Observable<Notification> {
    const url = `${this.notificationBaseUrl}/${notificationId}`;
    return this.httpClient.get<Notification>(url);
  }

  getCountOfNotificationByReceiver(notificationReceiver: number): Observable<number> {
    return this.httpClient.get<number>(`${this.notificationBaseUrl}/count/${notificationReceiver}`);
  }

  getNotificationsByType(notificationType: string): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`${this.notificationBaseUrl}/findByNotificationType/${notificationType}`);
  }

  
  getNotificationsByReceiver(notificationReceiver: number): Observable<{ [key: string]: Notification[] }> {
    const url = `${this.notificationBaseUrl}/getNotificationUser/${notificationReceiver}`;
    return this.httpClient.get<Notification[]>(url).pipe(
      map((notifications: Notification[]) => {
        const filteredNotifications: { [key: string]: Notification[] } = {
          COMMENT: [],
          FOLLOW: [],
          LIKE: []
        };
  
        notifications.forEach(notification => {
          const notificationType: string = notification.notificationType.toString();
  
          switch (notificationType) {
            case 'COMMENT':
              filteredNotifications['COMMENT'].push(notification);
              break;
            case 'FOLLOW':
              filteredNotifications['FOLLOW'].push(notification);
              break;
            case 'LIKE':
              filteredNotifications['LIKE'].push(notification);
              break;
            default:
              break;
          }
        });
  
        return filteredNotifications;
      })
    );
  }

  
  

}
