import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private product: Product | null = null; // Initialize product as null

  searchKey: string = '';
  category: string = '';
  state: string = '';
  color: string = '';
  size: string = '';
  brand: string = '';
  minPrice: number = 0;
  maxPrice: number = 1000;

  baseUrl = "http://localhost:8034/restapi/product";

  constructor(private httpClient: HttpClient) { }

  getProductBySeller(productSeller: number): Observable<any> {
    const url = `${this.baseUrl}/getProductBySeller/${productSeller}`;
    return this.httpClient.get<Product>(url);
  }



  getProductByCategory(productCategory: string): Observable<any> {
    const url = `${this.baseUrl}/getProductByCategory/${productCategory}`;
    return this.httpClient.get<any>(url);
  }

  addProduct(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}`, formData);
  }

  getAllProducts(searchKey: string,category: string , state: string, color: string, size: string, brand: string, minPrice: number = 0, maxPrice: number = 1000, ): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/filterProducts?searchKey=${searchKey}&category=${category}&state=${state}&color=${color}&size=${size}&brand=${brand}&minPrice=${minPrice}&maxPrice=${maxPrice}`);

  }

  buyProduct(productId: number, requestBody: any): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseUrl}/buyProduct/${productId}`, requestBody);
  }

  getProductById(productId: number): Observable<Product> {
    const url = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(url);
  }


  getCountOfProductBySeller(productSeller: number): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/countProduct/${productSeller}`);
  }


  deleteProductById(productId: number): Observable<any> {
    return this.httpClient.delete(`http://localhost:8034/restapi/product/${productId}`);
  }

  updateProduct(productId: number, updatedProduct: Product): Observable<Product> {
    const url = `${this.baseUrl}/${productId}`;
    return this.httpClient.put<Product>(url, updatedProduct);
  }
  
  setProduct(product: Product): void {
    this.product = product;
  }

  getProductGlobally(): Product | null {
    return this.product;
  }

  saveProductInfo(product: Product): void {
    localStorage.setItem('productInfo', JSON.stringify(product));
  }

  getAllHomeProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }
  

  setProductOnHold(productId: number): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseUrl}/putProductOnHold/${productId}`, {});
  }
  
}
