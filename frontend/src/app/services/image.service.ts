import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {}

  searchImages(searchTerms: string[]): Observable<any> {
    const joinedSearchTerms = searchTerms.join('&');
    console.log(joinedSearchTerms);
    return this.http.get(`/api/search?term=${joinedSearchTerms}`);
  }
}
