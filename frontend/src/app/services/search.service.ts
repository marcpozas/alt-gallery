import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerms: string[] = [];

  constructor() { }

  setSearchTerms(terms: string[]): void {
    this.searchTerms = terms;
  }

  getSearchTerms(): string[] {
    return this.searchTerms;
  }
}