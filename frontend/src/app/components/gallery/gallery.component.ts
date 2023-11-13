import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  searchImages$: string[] = [];

  constructor(private imageService: ImageService,
              private searchService: SearchService) {}

  ngOnInit() {  
    this.searchImages$ = this.searchService.getSearchTerms();
  }

  public onSearchImages(termsArray: string[]): void {
    this.searchImages$ = termsArray;
    console.log(this.searchImages$);
    this.getImages();
  }

  public getImages(): void {
    if (this.searchImages$) {
      this.imageService.searchImages(this.searchImages$).subscribe((results) => {
        console.log(results);
      });
    }
  }

}
