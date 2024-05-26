import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Guest } from './guest';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private baseUrl = "http://localhost:8034/restapi/guest";
  
  constructor(private httpClient: HttpClient) { }

  addGuestOrder(formData: FormData): Observable<any>{
    return this.httpClient.post(`${this.baseUrl}`, formData)
  }

  

}
