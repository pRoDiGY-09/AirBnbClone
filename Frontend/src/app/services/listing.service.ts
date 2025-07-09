import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviornments/enviornment';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  private api=`${environment.apiBaseUrl}`;

  constructor(private http:HttpClient) { }

  getListings(){
    return this.http.get('http://localhost:3000/api/allListings');
  }
}
