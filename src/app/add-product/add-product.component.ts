import { Component } from '@angular/core';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {

  isLoading: boolean = false;
  productImages: string[] = ['','','','','','']; // Initialize with null or empty values

  productPictureFiles: File[] = [];

  product = {
    productName: '',
    productDescription: '',
    productSeller: "",
    productCategory: '',
    productBrand: '',
    productState: '',
    productSize: '',
    productColor: '',
    productPrice: '',
    productOriginalPrice: '',
    productPic1: '',
    productPic2: '',
    productPic3: '',
    productPic4: '',
    productPic5: ''
  };

  constructor(private productService: ProductService) { }

  onSubmit(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo.userId;

    const formData = new FormData();
    formData.append('productName', this.product.productName);
    formData.append('productDescription', this.product.productDescription);
    formData.append('productSeller', userId);
    formData.append('productCategory', this.product.productCategory);
    formData.append('productBrand', this.product.productBrand);
    formData.append('productState', this.product.productState);
    formData.append('productSize', this.product.productSize);
    formData.append('productColor', this.product.productColor);
    formData.append('productPrice', this.product.productPrice);
    formData.append('productOriginalPrice', this.product.productOriginalPrice);
    this.productPictureFiles.forEach((file, index) => {
      formData.append(`productPic${index + 1}`, file, file.name);
    });

    console.log('Submitting form...');

    this.isLoading = true;

    this.productService.addProduct(formData).subscribe(
      response => {
        this.product = {
          productName: '',
          productDescription: '',
          productSeller: '',
          productCategory: '',
          productBrand: '',
          productState: '',
          productSize: '',
          productColor: '',
          productPrice: '',
          productOriginalPrice: '',
          productPic1: '',
          productPic2: '',
          productPic3: '',
          productPic4: '',
          productPic5: ''
        };
        this.productPictureFiles = [];
        console.log('Product added successfully:', response);
      },
      error => {
        console.error('Error adding product:', error);
      }
    );
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.productPictureFiles[index] = file;
      this.readImage(file, index);
    }
  }

  readImage(file: File, index: number): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.productImages[index] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  getIndex(image: string): number {
    return this.productImages.indexOf(image);
  }

  deleteImage(index: number): void {

  }
}
