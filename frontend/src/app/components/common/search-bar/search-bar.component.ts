import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() isLanding: boolean = false;
  userInput: string = '';
  placeholder: string = 'Fluffy seal on the snow';

  constructor(private imageService: ImageService,
              private router: Router,
              private searchService: SearchService) {  }

  @Output() searchImages = new EventEmitter<string[]>();

  public onSearch(): void {
    console.log(this.userInput);
    const termsArray = this.userInput.trim().split(/[ ,.]+/);
    console.log(termsArray);
    this.userInput = "";
    if (termsArray) {
      if (this.isLanding) {
        this.onNavigateToGallery(termsArray);
      } else {
        this.searchImages.emit(termsArray);
      }
    }
  }

  public onNavigateToGallery(searchTerms: string[]): void {
    this.searchService.setSearchTerms(searchTerms);
    this.router.navigate(['/gallery']);
  }
}