import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {

  productpic1: string = '';
  productpic2: string = '';
  productpic3: string = '';
  productpic4: string = '';
  productpic5: string = '';

  imageUrls: string[] = [];
  tryd: string = '';

  productImages: string[] = ['', '', '', '', ''];


  productPictureFile: File | null = null;




  constructor(private http: HttpClient, private productService: ProductService, private route: ActivatedRoute) {}



  updatedProduct: Product = { productId: this.route.snapshot.params['productId'], productName: '', productCategory: '', productBrand: '', productSize: '', productState: '', productDescription: '', productPrice: '', productOriginalPrice: '', productColor: '', productPic1: '', productPic2: '', productPic3: '', productPic4: '', productPic5: '', isClicked:true };

  ngOnInit() {

    this.http.get<any>(`http://localhost:8034/restapi/product/${this.updatedProduct.productId}`).subscribe(
      (data) => {

        this.updatedProduct.productName = data.productName;
        this.updatedProduct.productDescription = data.productDescription;
        this.updatedProduct.productCategory = data.productCategory;
        this.updatedProduct.productBrand = data.productBrand;
        this.updatedProduct.productState = data.productState;
        this.updatedProduct.productColor = data.productColor;
        this.updatedProduct.productSize = data.productSize;
        this.updatedProduct.productPrice = data.productPrice;
        this.updatedProduct.productOriginalPrice = data.productOriginalPrice;

        this.updatedProduct.productPic1 = data.productPic1;
        this.productImages = [data.productPic1, data.productPic2, data.productPic3, data.productPic4, data.productPic5].map(pic => pic ? `data:image/jpg;base64, ${pic}` : '');

        this.productpic1 = "data:image/jpg;base64, " + data.productPic1;
        this.tryd = this.productpic1;

        
        /*
        this.updatedProduct.productPic2 = data.productPic2;
        this.productpic2 = "data:image/jpg;base64, " + data.productPic2;



        this.updatedProduct.productPic2 = data.productPic3;
        this.productpic3 = "data:image/jpg;base64, " + data.productPic3;



        this.updatedProduct.productPic3 = data.productPic4;
        this.productpic4 = "data:image/jpg;base64, " + data.productPic4;


        this.updatedProduct.productPic4 = data.productPic5;
        this.productpic5 = "data:image/jpg;base64, " + data.productPic5;
        */


      },
      (error) => {
        console.error('Error fetching user image:', error);
      }
    );
  }

  updateProduct(): void {
    this.productService.updateProduct(this.updatedProduct.productId, this.updatedProduct).subscribe(
      (response) => {
        console.log('Product updated successfully:', response);
        window.location.reload();
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }
/*
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productPictureFile = file;
      this.readImage(file);
      // Convert the selected file to base64
      this.convertFileToBase64(file);
    }
  }
  */
  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.convertFileToBase64(file, index);
    }
  }

  readImage(file: File): void {
    const reader = new FileReader();
  
    reader.onload = () => {
      this.updatedProduct.productPic1 = reader.result as string;
    };
  
    reader.readAsDataURL(file);
  }
/*
  private convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {

      this.productPictureFile = file;


      // Assign the base64 content directly to userProfilePic
      this.updatedProduct.productPic1 = reader.result as string;
      this.tryd = this.updatedProduct.productPic1;
      console.log("tryd************************************************************************************")

      console.log(this.updatedProduct.productPic1);

      // Remove the prefix from userProfilePic
      const [, updatedProductPic] = this.updatedProduct.productPic1.split(',');
      this.updatedProduct.productPic1 = updatedProductPic;

      console.log(updatedProductPic);
      this.updatedProduct.productPic1 = updatedProductPic;
      this.productpic1 = updatedProductPic;

    };
    reader.readAsDataURL(file);
  }
  */
  private convertFileToBase64(file: File, index: number): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result as string;
      this.productImages[index] = base64Str;
      switch (index) {
        case 0: this.updatedProduct.productPic1 = base64Str.split(',')[1]; break;
        case 1: this.updatedProduct.productPic2 = base64Str.split(',')[1]; break;
        case 2: this.updatedProduct.productPic3 = base64Str.split(',')[1]; break;
        case 3: this.updatedProduct.productPic4 = base64Str.split(',')[1]; break;
        case 4: this.updatedProduct.productPic5 = base64Str.split(',')[1]; break;
      }
    };
    reader.readAsDataURL(file);
  }
  
  
  /*
  deleteImage(index: number): void {
    this.imageUrls.splice(index, 1);
    this.productPictureFile.splice(index, 1);
  }
  */
  getIndex(image: string): number {
    return this.productImages.indexOf(image);
  }




}
