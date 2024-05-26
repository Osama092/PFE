import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { MatAccordion } from '@angular/material/expansion';
import { UserInteractionService } from '../user-interaction.service';
import { Favorite } from '../favorite';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;
  
  
  userPic: string = '';
  user_username: string = '';
  filterSearch: string = '';
  filterCategory: string = '';
  filterColor: string = '';
  filterSize: string = '';
  filterState: string = '';
  filterBrand: string = '';
  filterMinPrice: number = 10;
  filterMaxPrice: number = 1000;
  products: any[] | undefined;
  userFavoriteProducts: Favorite[] | undefined;
  favoriteProducts: Favorite[] | undefined;


  fashionCategorys: string[] = [
    'Jackets & Coats', 'Jeans', 'Pants', 'Shorts', 'T-Shirts', 'Sweaters', 'Hoodies', 'Suits', 'Shoes', 'Boots', 'Sneakers',
    'Belts', 'Hats', 'Watches', 'Jewelry', 'Other'

  ];

  fashionSizes: string[] = [
    '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
    'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', 'Other'
  ];

  
  fashionStates: string[] = [
    'New With Label', 'Very Good State', 'Good Condition', 'Satisfying'
  ]
  

  fashionBrands: string[] = [
    '1 2 3', '3 Suisses', 'A.J. Morgan Eyewear', 'ASOS', 'AX Paris', 'Abercrombie', 'Acanthe', 'Adidas', 'Aigle',
    'Alain Manoukian', 'Alaïa', 'Aldo', 'Alexandre McQueen', 'Alexandre Vauthier', 'All Stars Converse', 'Amedeo Testoni',
    'American Angel', 'American Eagle', 'André','Angés B', 'Antik Batik', 'Armand Thierry', 'Armani', 'Asics', 'Atmosphère',
    'Audemars Piguet', 'Azzarro', 'BOGNER', 'Babyliss', 'Balenciaga', 'Balmain', 'Bata', 'Bcbg Maxmara', 'Bella Vita',
    'Bellissima', 'Benefit', 'Benetton', 'Best Mountain', 'Blanco', 'Boccage', 'Boohoo', 'Bottega Veneta', 'Boucheron',
    'Bourjois', 'Breitling', 'Brunello Cucinelli', 'Burberry', 'Bvlgari', 'Byphasse', 'C&A', 'Cacharel', 'Cache Cache',
    'Calvin Klein', 'Calzedonia', 'Camaieu', 'Capricia', 'Carolina Herrera', 'Caroll', 'Cartier', 'Casadei', 'Cedrillon',
    'Celine', 'Celio', 'Chanel', 'Charles Jourdan', 'Chaumet', 'Chloé', 'Chopard', 'Christian Lacroix', 'Claire\'S',
    'Clarins', 'Clarks', 'Coach', 'Converse', 'Cristian Lay', 'D&G', 'Daisy', 'Daloush', 'Daniel Klein', 'Daniel Wellington',
    'David Jones', 'Derhy', 'Desigual', 'Diesel', 'Dior', 'Dixit', 'Dkny', 'Dpm', 'Dunhill', 'EMILIO PUCCI', 'Elie Saab',
    'Elisabetta Franchi', 'Elite', 'Enzo', 'Escada', 'Esthere Maryline', 'Estée Lauder', 'Etam', 'Extreme', 'Farmasi',
    'Fendi', 'Ferrari', 'Festina', 'Fila', 'Forever 21', 'Fossil', 'Furla', 'GOYARD', 'Gap', 'Gemo', 'Geox', 'Giorgio Armani',
    'Giuseppe Zanotti', 'Givenchy', 'Gucci', 'Guerlain', 'Guess', 'Gypset', 'H&M', 'Hamadi Abid', 'Hello Kitty', 'Hermes',
    'Hogan', 'Hugo Boss', 'IKKS', 'Ice Watch', 'In Extenso', 'J. Crew', 'JNBY', 'JOOP!', 'Jancel', 'Jennyfer', 'Jimmy Choo', 'Jonas',
    'Justfab', 'Kerping', 'Karl Lagerfeld', 'Kenzo', 'Kiabi', 'Kiko', 'Kookai', 'La Redoute', 'La Vie Est Belle', 'La bagagerie',
    'Lacoste', 'Lancome', 'Lanvin', 'Lc Waikiki', 'Le Coq Sportif', 'Le Grossiste', 'Lee Cooper', 'Lefties', 'Levi\'S',
    'Little Marcel','Liu JO', 'Longchamps', 'Longines', 'Louboutin', 'Louis Vuitton', 'Lulu Catagnette', 'Lynso', 'MISCHKA AOKI',
    'Mabrouk', 'Mac', 'Mango', 'Marc Jacobs', 'Marionnaud', 'Marwa', 'Massimo Dutti', 'Mauboussin', 'Maximo Donati', 'Maybelline',
    'Mexx', 'Mezianna', 'Michael Kors', 'Mim', 'Minelli', 'Miu Miu', 'Moncler', 'Monki', 'Monoprix', 'Monoprix', 'Monsoon',
    'Mont Blanc', 'Morgan', 'Moschino', 'Motivi', 'NO NAME', 'Nafnaf', 'New Balance', 'Newlook', 'Next', 'Nike', 'Nina Ricci',
    'Nine West', 'Nitta Bijoux', 'Nivea', 'Nuxe', 'Oasis', 'Off-White', 'Oltre', 'Omega', 'Oriflame', 'Oysho', 'PINKO', 'Parfois',
    'Pepe Jeans', 'Phildar', 'Pimkie', 'Police', 'Prada', 'PrimaDonna', 'Primark', 'Promod', 'Pronovias', 'Pull&Bear', 'Puma',
    'Punt Roma', 'Quartz', 'Ralph Lauren', 'Ray Ban', 'Redtag', 'Reebok', 'Remington','Repetto', 'Rimmel', 'River Island', 'Roberto Cavalli',
    'Rolex', 'Roxy', 'Saint Laurent', 'Salvatore Ferragamo', 'San Marina', 'Sandro', 'Sasio', 'Scholl', 'Sebago', 'Sephora',
    'Sergio Puccini', 'Sergio Rossi', 'Shana', 'Shein', 'Sirina Mode', 'Sisley', 'Six', 'Skechers', 'Sonia Rykiel', 'Springfield',
    'Stella McCartney', 'Steve Madden', 'Stradivarius', 'Sud Express', 'Suite Blanco', 'Swarovski', 'Swatch', 'TAG Heuer',
    'THE NORTH FACE', 'Tally Weijl', 'Tamaris', 'Tara Jarmon', 'Temps Des Cerises', 'Tex', 'Texto', 'Thierry Mugler', 'Tiffany & Co.',
    'Timberland', 'Tissot', 'Tod’s', 'Tom Ford', 'Tom Tailor', 'Tommy Hilfiger', 'Tory Burch', 'Toscani', 'Trussardi', 'U.S Polo',
    'Ugg', 'Undiz', 'Valentino', 'Vans', 'Vera Wang', 'Vero Moda', 'Versace', 'Vincci', 'Vivienne Westwood', 'Vogue', 'Yessica',
    'Yves Rocher', 'Zadig & Voltaire', 'Zara', 'Zen', 'Other'
  ];


  constructor(
    private authService: AuthService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private userInteractionService: UserInteractionService,
    private httpClient: HttpClient,
    private userService: UserService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  isClicked: boolean = false;
  favoriteProductId!: number;
  public userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  userId : number = this.userInfo.userId;


  heartClicked(product: any) {
    product.isClicked = !product.isClicked; // Toggle the click state for the specific product
    this.favoriteProductId = product.productId

    if (product.isClicked) {
      this.addProductToFavorite();
    } else {
      const favoriteToRemove = this.userFavoriteProducts?.find(favorite => favorite.favoriteProduct === product.productId);
      if (favoriteToRemove) {
        this.removeFavorite(favoriteToRemove);
      }
    }

  }

  


  receivedCategory: string = '';

  ngOnInit(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo.userId;
    localStorage.setItem('secondeUserId', userId);

    console.log('user id form token in home is ', userId)
    if (history.state && history.state.data) {
      this.receivedCategory = history.state.data;
      console.log(this.receivedCategory)
      this.filterCategory = this.receivedCategory;
    }
    
    this.loadUserFavoriteProducts()
    this.getAllProducts(); // Load all products initially
    this.getUserDetails(); // Load user details

  }


  

  filterByProductNameOrDescription(filterSearch: string) {
    console.log('Search filter:', filterSearch);
    this.getAllProducts();

  }

  filterByCategory(filterCategory: string) {
    console.log('Categorie filter:', filterCategory);
    this.getAllProducts();

  }

  filterByColor(color: string) {
    this.filterColor = color;
    console.log('Color filter:', this.filterColor);
    this.getAllProducts();

  }
  filterBySize(filterSize: string) {
    console.log('Size filter:', filterSize);
    this.getAllProducts();
  
  }
  filterByState(filterState: string) { 
    console.log('State filter:', filterState);
    this.getAllProducts();

  }
  filterByBrand(filterBrand: string) {
    console.log('Brand filter:', filterBrand);
    this.getAllProducts();

  }
  filterByPriceRange(filterMinPrice: number, filterMaxPrice: number) {
    console.log('Min price filter', filterMinPrice);
    console.log('Max price filter', filterMaxPrice);
    this.getAllProducts();

  }

  private getAllProducts() {
    const colorrr = (this.filterColor ? `color=${this.filterColor}` : '');
    const filterUrl =
      (this.filterSearch ? `searchKey=${this.filterSearch}&` : '') +
      (this.filterCategory ? `category=${this.filterCategory}&` : '') +
      (this.filterColor ? `color=${this.filterColor}&` : '') +
      (this.filterSize ? `size=${this.filterSize}&` : '') +
      (this.filterState ? `state=${this.filterState}&` : '') +
      (this.filterBrand ? `brand=${this.filterBrand}&` : '') +
      `minPrice=${this.filterMinPrice}&maxPrice=${this.filterMaxPrice}`;
  
    this.productService.getAllProducts(this.filterSearch, this.filterCategory, this.filterState, this.filterColor, this.filterSize, this.filterBrand, this.filterMinPrice, this.filterMaxPrice).subscribe((products) => {
      this.products = products.filter(product => product.productTag.includes('onSale')).map(product => ({
        ...product,
        isClicked: !!(this.userFavoriteProducts && this.userFavoriteProducts.some(favorite => favorite.favoriteProduct === product.productId))
      }));

      console.log(this.products)
  
      console.log(filterUrl);
  
      this.products.forEach((product) => {
        this.userService.getUserById(product.productSeller).subscribe(
          (user) => {
            if (user && user.userProfilePic) {
              
              product.product_holder = user.userProfilePic;
            }
          },
          (error) => {
            console.error('', error);
          }
        );
      });
    });
  
    
  }
  
  
  private getUserDetails() {
    this.httpClient.get<any>(`http://localhost:8034/restapi/user/${this.userId}`).subscribe(
      (data) => {
        this.userPic = data.userProfilePic;
        this.user_username = data.userUsername;
      },
      (error) => {
        console.error('Error fetching user image:', error);
      }
    );
  }

  goToAddProductPage() {
    this.router.navigate(['/add-product', this.userId]);
  }
  resetFilters() {
    this.filterSearch = '';
    this.filterCategory = '';
    this.filterColor = '';
    this.filterSize = '';
    this.filterState = '';
    this.filterBrand = '';
    this.filterMinPrice = 10;
    this.filterMaxPrice = 1000;
  
    // Call the method to reload products with the updated filters
    this.getAllProducts();
  }

  colorisClicked: boolean = false;


  colors = [
    { name: 'White', value: '#FFFFFF', isSelected: false },
    { name: 'Black', value: '#000000', isSelected: false },
    { name: 'Gray', value: '#808080', isSelected: false },
    { name: 'Silver', value: '#C0C0C0', isSelected: false },
    { name: 'Beige', value: '#F5F5DC', isSelected: false },
    { name: 'Brown', value: '#964B00', isSelected: false },
    { name: 'Camel', value: '#C19A6B', isSelected: false },
    { name: 'Gold', value: '#FFD700', isSelected: false },
    { name: 'Coral', value: '#FF6F61', isSelected: false },
    { name: 'Yellow', value: '#40E0D0', isSelected: false },
    { name: 'Blue', value: '#0000ff', isSelected: false },
    { name: 'Turquoise', value: '#40E0D0', isSelected: false },
    { name: 'Green', value: '#008000', isSelected: false },
    { name: 'Mint Green', value: '#98FF98', isSelected: false },
    { name: 'Purple', value: '#800080', isSelected: false },
    { name: 'Orange', value: '#FFA500', isSelected: false },
    { name: 'Pink', value: '#FFC0CB', isSelected: false },
    { name: 'Powder Pink', value: '#FFB6C1', isSelected: false },
    { name: 'Red', value: '#FF0000', isSelected: false },
    { name: 'Nude', value: '#FFE4B5', isSelected: false },
  ];

  filteredColors = this.colors.slice(0, 3); // Display only the first three colors initially
  showAllColors = false;

  handleClick() {
    this.colorisClicked = !this.colorisClicked;
      console.log("color is clicked");
    
  }

  selectedColor: any = null;

  

  selectColor(color: any) {
    // If the clicked color is already selected, deselect it
    // Otherwise, select the clicked color and deselect the previously selected color
    this.selectedColor = this.selectedColor === color ? null : color;
    // Unselect all other colors
    this.colors.forEach(c => c.isSelected = (c === this.selectedColor));
    // Apply filter
    this.filterByColor(this.selectedColor ? this.selectedColor.name : '');
  }

  addProductToFavorite() {
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    
    const favoriteProductClicked = {
      favoriteUser: userInfo.userId,
      favoriteProduct: this.favoriteProductId,
    }

    console.log('Clicked product ID:', );

    

    const formData = new FormData();
    
        formData.append('favoriteUser', favoriteProductClicked.favoriteUser);
        formData.append('favoriteProduct', favoriteProductClicked.favoriteProduct.toString());
        console.log('favorite data:', favoriteProductClicked.favoriteUser, favoriteProductClicked.favoriteProduct); // Log commentData for debugging

        this.userInteractionService.addFavorite(formData).subscribe(
          (response) => {
            console.log('Product Added to favorite', response);


          },
          (error) => {
            console.error('Error adding product to favorite:', error);
            
          }
        );
  }

  loadUserFavoriteProducts() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');


    this.userInteractionService.getFavoriteByUser(userInfo.userId).subscribe(
      (response: Favorite[]) => {
        this.userFavoriteProducts = response;
        console.log('Favorite products:', this.userFavoriteProducts);
      },
      (error) => {
        console.error('Error fetching favorite products:', error);
      }
    );
  }

  removeFavorite(favorite: Favorite) {
    this.userInteractionService.deleteFavoriteById(favorite.favoriteId).subscribe(
      () => {
        console.log('Favorite removed successfully');
      },
      (error) => {
        console.error('Error removing favorite:', error);
      }
    );
  }
  
 
}