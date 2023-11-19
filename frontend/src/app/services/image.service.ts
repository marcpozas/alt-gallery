import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}

  searchImages(page: number, count: number, searchTerms: string): Observable<any> {
    console.log(page);
    return this.http.get(`http://localhost:3500/images?page=${page}&count=${count}&searchTerms=${searchTerms}`);
  }

  searchUserImages(page: number, count: number, username: string): Observable<any> {
    console.log(page);
    return this.http.get(`http://localhost:3500/userImages?page=${page}&count=${count}&username=${username}`);
  }
}
