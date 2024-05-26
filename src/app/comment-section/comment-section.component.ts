import { Component, Input } from '@angular/core';
import { UserInteractionService } from '../user-interaction.service';
import { UserService } from '../user.service';
import { ProductService } from '../product.service';
import { formatDistanceToNow } from 'date-fns';

import { Product } from '../product';
import { User } from '../user';
import { Comment } from '../comment';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.css'
})
export class CommentSectionComponent {
  //@Input() comments: string[] = [];
  newComment: string = '';
  comments: any[] = [];
  product: Product | null = null;
  userToken = JSON.parse(localStorage.getItem('userToken') || '{}');

  commentOwner: User | undefined;
  tempuserid!: number;

  secondeUserId = localStorage.getItem('secondeUserId');



  


  


  constructor(private userInteractionService: UserInteractionService, private productService: ProductService, private userService: UserService ) { }

  ngOnInit(): void {
    console.log('seconde user id  in product detaill is ', this.secondeUserId);


    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo.userId;
    

    this.product = this.productService.getProductGlobally();

      this.loadComment();
      console.log('we found this product in comment', this.product);
      console.log('and his id is', this.product!.productId);
  }
  
  

 
  
  loadComment() {
    console.log("loading comment //////////////////////////////////////////////")
    console.log('product id is ', this.product?.productId);

    this.userInteractionService.getCommentByProduct(this.product!.productId).subscribe(
      (response) => {
        console.log(response);
        console.log("//////////////////////////////////////////////")

  
        this.comments.forEach((comment) => {
          // Push commentUser of each comment object into blabla array
          // Fetch user info for each commentUser
          this.getUserInfo(comment.commentUser).then((user) => {
            // Assign user information to the comment object
            comment.commentOwner = user;
            // Once user info is fetched and assigned, you can proceed with displaying comments
            console.log('User info fetched for comment user:', comment.commentUser);
          });
  
          // Calculate time ago for comment date
          comment.commentTimeAgo = formatDistanceToNow(new Date(comment.commentDate), { addSuffix: true });
        });
        console.log(this.comments);
        console.log(response);
      },
      (error) => {
        console.error('Error fetching comment', error);
      }
    );
  }
  
  getUserInfo(commentUserId: number): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
      this.userService.getUserById(commentUserId).subscribe(
        user => {
          resolve(user); // Resolve the promise with user information
        }, 
        error => {
          console.error('Error fetching user:', error);
          reject(error); // Reject the promise if there's an error
        }
      );
    });
  }
  


  addComment() {
    const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');


    const userComment = {
      commentContent:this.newComment,
      commentUser: userToken.userId,
      commentProduct: this.product!.productId
    }
    

      const formData = new FormData();

  
      

        formData.append('commentContent', userComment.commentContent);
        formData.append('commentUser', userComment.commentUser);
        formData.append('commentProduct', userComment.commentProduct.toString());


        
        
        console.log('Comment data:', userComment.commentContent, userComment.commentUser, userComment.commentProduct); // Log commentData for debugging

        this.userInteractionService.addComment(formData).subscribe(
          (response) => {
            console.log('Comment added successfully:', response);
            // If you want to update comments list after adding a new comment
            this.loadComment();
            // Clear the new comment input field
            this.newComment = '';
          },
          (error) => {
            console.error('Error adding comment:', error);
            // Handle error
          }
        );
      }
    
  
  
    

  
  
  
  
  
  
}
