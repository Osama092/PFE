import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { BuyProductComponent } from '../buy-product/buy-product.component';
import { ReportProductComponent } from '../report-product/report-product.component';
import { UserInteractionService } from '../user-interaction.service';
import { UserService } from '../user.service';
import { ProductService } from '../product.service';
import { formatDistanceToNow } from 'date-fns';
import { ProductShareComponent } from '../product-share/product-share.component';

import { Product } from '../product';
import { User } from '../user';
import { Comment } from '../comment';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  providers: [DatePipe]
  
})
export class ProductDetailComponent {
  productId!: number;
  productSellerId!: string;
  newCommentValue: string = '';


  products!: any[];
  similarProducts: any[] | undefined;
  product_holder: string = '';
  userUsername: string = '';
  userBio: string = '';
  userProfilePicture: string = '';
  timeDifference: any = {};
  showDeleteButton: boolean = false; // Add this property
  deleteId!: number;
  similarproductCategory!: string;
  newComment: string = '';
  comments: any[] = [];
  product: Product | null = null;
  userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
  likeCount!: number;

  userPic!: string;

  commentOwner: User | undefined;
  tempuserid!: number;

  secondeUserId = localStorage.getItem('secondeUserId');


  constructor(private router: Router, private productService: ProductService, private httpClient: HttpClient, private route: ActivatedRoute, private userService: UserService, private datePipe: DatePipe, public dialog: MatDialog, private userInteractionService: UserInteractionService) { }

  
 


  ngOnInit(): void {
    const productIdParam = this.route.snapshot.paramMap.get('productId');
    

    this.productId = productIdParam ? parseInt(productIdParam, 10) : 0;
    this.loadComment();


    if (isNaN(this.productId) || this.productId <= 0) {
      console.error('Invalid productId:', productIdParam);

      return;
    }
    

    
    

    this.httpClient.get<any>(`http://localhost:8034/restapi/product/${this.productId}`)
      .subscribe(
        product => {
          this.products = [product];
          
          this.productService.setProduct(product);
          this.productService.saveProductInfo(product);

          this.similarproductCategory = product.productCategory;

          


          this.getProductByCategory()


          this.userService.getUserById(product.productSeller).subscribe(
            user => {
              this.product_holder = user.userUsername;
              this.userBio = user.userBio;
              this.userProfilePicture = user.userProfilePic;
              this.productSellerId = product.productSeller;


              // In your other component
                    const secondeUserId = localStorage.getItem('secondeUserId');
                    if (secondeUserId) {
                        console.log('Second User ID:', secondeUserId);
                    } else {
                        console.log('Second User ID not found in localStorage');
                    }


              const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
              this.userPic = userInfo.userProfilePic;

              if (userInfo && userInfo.userId) {
                const userId = userInfo.userId;
                
                const secondeUserId = localStorage.getItem('secondeUserId');


                // Check if the user ID from the token matches the product seller's ID
                if (userId == product.productSeller) {
                  this.showDeleteButton = true;
                  this.deleteId = userId;
                  

                  console.log('it matches yehhhooo')
                } else {
                  console.log('not the same');
                }
              }
              

              // Calculate time difference
              const productAddedDate = new Date(product.product_added_date).toLocaleDateString();

              // Convert current date to a consistent format
              const currentDate = new Date().toLocaleDateString();
    
              // Calculate time difference
              const timeDifference = new Date(currentDate).getTime() - new Date(productAddedDate).getTime();
    
              const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
              const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

              
              if (daysDifference > 1) {
                // If more than 1 day, display "more than a day"
                this.timeDifference = {
                  value: 'more than a day',
                };
              } else if (hoursDifference > 0) {
                // If more than 0 hours, display hours
                this.timeDifference = {
                  value: hoursDifference,
                  unit: 'hour(s)',
                };
              } else {
                // If less than 1 hour, display minutes
                this.timeDifference = {
                  value: minutesDifference,
                  unit: 'minute(s)',
                };
              }
              
            },
            error => {
              if (error.status === 404) {
                console.error('User not found:', product.productSeller);
              } else {
                console.error('Error fetching user data:', error);
              }
            }
          );

        },
        error => {
          console.error('Error fetching product:', error);
        }
    );

    this.userInteractionService.getCountOfFavoritesByProduct(this.productId).subscribe(
      count => {
        this.likeCount = count;
      },
      error => {
        console.error('Error fetching notification count:', error);
      }
    );

    
    
    
  }



  editProduct(productId: number, event: Event) {
    event.preventDefault(); // Prevent the default anchor action

    this.router.navigate(['edit-product', productId]);
  }

  deleteProduct(productId: number, event: Event): void {
    event.preventDefault(); // Prevent the default anchor action
    if (confirm('Are sure you want to delete this product?')) {
      this.productService.deleteProductById(productId).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          this.router.navigate(['home']);

        },
        error: err => {
          console.error('Error deleting product:', err);
          // Handle error
        }
      });
    }
  }
  
  

  getImages(product: any): string[] {
    const images: string[] = [];

    for (let i = 1; i <= 5; i++) {
      const imageKey = `productPic${i}`;
      if (product[imageKey]) {
        images.push(product[imageKey]);
      }
    }

    return images;
  }

  
  

  goToProductSellerProfilePage() {
    this.router.navigate(['/user-profile', this.productSellerId]);
  }

  private getProductByCategory() {
    console.log('simialr product is ' ,this.similarproductCategory)
    this.productService.getProductByCategory(this.similarproductCategory).subscribe(
      (product: any[]) => {
        this.similarProducts = product;

      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
    
  }
  
  openBuyDialog() {
    const dialogRef = this.dialog.open(BuyProductComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openReportDialog() {
    const dialogRef = this.dialog.open(ReportProductComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openShareDialog() {
    this.dialog.open(ProductShareComponent,
      {
       width: '500px'
     })
  }



  loadComment() {
    console.log('check here 1')

    this.userInteractionService.getCommentByProduct(this.productId).subscribe(
      (response) => {
        this.comments = response;
        console.log(this.comments)
        this.comments.forEach((comment: any) => {

          this.getUserInfo(comment.commentUser).then((user) => {

            comment.commentOwner = user;
          });
  
        });
        
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
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    
    const userComment = {
      commentContent:this.newComment,
      commentUser: userInfo.userId,
      commentProduct: this.productId,
    }
    

    const formData = new FormData();
    
        formData.append('commentContent', userComment.commentContent);
        formData.append('commentUser', userComment.commentUser);
        formData.append('commentProduct', userComment.commentProduct.toString());


        
        
        console.log('Comment data:', userComment.commentContent, userComment.commentUser, userComment.commentProduct); // Log commentData for debugging

        this.userInteractionService.addComment(formData).subscribe(
          (response) => {
            console.log('Comment added successfully:', response);

            this.loadComment();

            this.newComment = '';
          },
          (error) => {
            console.error('Error adding comment:', error);
            
          }
        );
  }


formatCommentTime(commentDate: string): string {
  if (!commentDate) return '';
  

  const commentDateTime = new Date(commentDate);
  const currentDateTime = new Date();
  const timeDifference = Math.abs(currentDateTime.getTime() - commentDateTime.getTime());

  // Calculate time difference in minutes
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));

  if (minutesDifference < 1) {
    return 'now';
  } else if (minutesDifference < 60 * 24) {
    const hoursDifference = Math.floor(minutesDifference / 60);
    return hoursDifference === 1 ? '1 hour ago' : `${hoursDifference} hours ago`;
  } else {
    const daysDifference = Math.floor(minutesDifference / (60 * 24));
    return daysDifference === 1 ? '1 day ago' : `${daysDifference} days ago`;
  }
}

  
}
