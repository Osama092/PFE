import { Component, } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInteractionService } from '../user-interaction.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  constructor(
    private userInteractionService: UserInteractionService,
    private httpClient: HttpClient,
    private userService: UserService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}
  
  products: Product[] = [];
  responsiveOptions: any; // Define responsive options if needed
  reviewResponsiveOptions: any;
  filteredProducts: Product[] = [];
  suitsCategory: string = 'Suits';
  sneakersCategory: string = 'Sneakers';
  accessoriesCategory: string = 'Other';
  pantsCategory: string = 'Pants';
  
  suitCategory() {
    this.router.navigate(['home'], { state: { data: this.suitsCategory } });
  }
  pantCategory() {
    this.router.navigate(['home'], { state: { data: this.pantsCategory } });
  }
  sneakerCategory() {
    this.router.navigate(['home'], { state: { data: this.sneakersCategory } });
  }
  accessorieCategory() {
    this.router.navigate(['home'], { state: { data: this.accessoriesCategory } });
  }


  reviews: any[] = [
    {
      review_user: 'Remol',
      review_content: 'Lorem ipsum dolor sit amet. Ut aspernatur architecto ut excepturi necessitatibus est eveniet consequuntur',
      review_state: 'Frelijord',
      review_user_pic: 'assets/multi.21bf528e99bdfae4.jpg'
    },
    {
      review_user: 'Olerm',
      review_content: 'Lorem ipsum dolor sit amet. Ut aspernatur architecto ut excepturi necessitatibus est eveniet consequuntur',
      review_state: 'Demacia',
      review_user_pic: 'assets/multi.21bf528e99bdfae4.jpg'
    },
    {
      review_user: 'Erol',
      review_content: 'Lorem ipsum dolor sit amet. Ut aspernatur architecto ut excepturi necessitatibus est eveniet consequuntur',
      review_state: 'Pilgwater',
      review_user_pic: 'assets/multi.21bf528e99bdfae4.jpg'
    },
    {
      review_user: 'Merol',
      review_content: 'Lorem ipsum dolor sit amet. Ut aspernatur architecto ut excepturi necessitatibus est eveniet consequuntur',
      review_state: 'Ionia',
      review_user_pic: 'assets/multi.21bf528e99bdfae4.jpg'
    },
    {
      review_user: 'Lorem',
      review_content: 'Lorem ipsum dolor sit amet. Ut aspernatur architecto ut excepturi necessitatibus est eveniet consequuntur',
      review_state: 'Everwhere',
      review_user_pic: 'assets/multi.21bf528e99bdfae4.jpg'
    },
  ]
  

  ngOnInit(): void {
    
    this.reviewResponsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.responsiveOptions = [
      {
          breakpoint: '1199px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '991px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  
    this.loadProducts();


  }

  loadProducts(): void {
    this.productService.getAllHomeProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  filterProductsByCategory(category: string): Product[] {
    return this.products.filter(product => product.productCategory === category);
  }

}
