import { Component } from '@angular/core';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent {
  img = './assets/multi.21bf528e99bdfae4.jpg';
  containerStyle = {
    'background-image': `url(${this.img})`,
    'background-size': 'cover',
    'background-position': 'center center',
  };
  selectedColor: string | null = null;


  onColorClick(color: string): void {
    this.selectedColor = color;
  }

  minPrice: number = 10;
  maxPrice: number = 1000;
  
}
