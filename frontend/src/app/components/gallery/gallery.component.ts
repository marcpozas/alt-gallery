import { ChangeDetectorRef, Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  searchTerms: string = "";
  results: { numberImages: number; search: string } = {numberImages: 0, search: ""};
  columns: number = 3;
  exampleImages = [
                    'https://ik.imagekit.io/oyazga6mf/00061-2623062973.png?updatedAt=1699959426168',
                    'https://ik.imagekit.io/oyazga6mf/00059-2115470041.png?updatedAt=1699959426216',
                    'https://ik.imagekit.io/oyazga6mf/00060-3477743195.png?updatedAt=1699959426170',
                    'https://ik.imagekit.io/oyazga6mf/00096-2278371147.png?updatedAt=1699961587721',
                    'https://ik.imagekit.io/oyazga6mf/00084-2404117627.png?updatedAt=1699961602354',
                    'https://ik.imagekit.io/oyazga6mf/00064-335079007.png?updatedAt=1699959426212',
                    'https://ik.imagekit.io/oyazga6mf/00056-2605862796.png?updatedAt=1699959426075',
                  ]
  countImages: number = this.exampleImages.length;

  constructor(private route: ActivatedRoute,
              private imageService: ImageService,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchTerms = params['searchTerms'];
      this.results["search"] = this.searchTerms;
      console.log(this.searchTerms);
      // this.results = this.searchTerms.join(" ");
      console.log(this.results)
      console.log(`init ${this.searchTerms}`);
      // this.imageService.searchImages(this.searchTerms).subscribe((results) => {
      //   console.log(results);
      // });
    });
  }

  ngAfterViewChecked() {
    this.calculateColumns();
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateColumns();
  }

  calculateColumns() {
    const windowWidth = window.innerWidth;
    if (windowWidth < 640 && this.columns != 1) {
      this.columns = 1;
    } else if (windowWidth >= 640 && windowWidth < 900 && this.columns != 2) {
      this.columns = 2;
    } else if (windowWidth >= 900 && windowWidth < 1166 && this.columns != 3){
      this.columns = 3; // Default number of columns
    } else if (windowWidth >= 1166 && windowWidth < 1500 && this.columns != 4){
      this.columns = 4; // Default number of columns
    } else if (windowWidth >= 1500 && windowWidth < 1850 && this.columns != 5){
      this.columns = 5; // Default number of columns
    } else if (windowWidth >= 1850 && windowWidth < 3000 && this.columns != 6){
      this.columns = 6; // Default number of columns
    }
    console.log(`this.columns: ${this.columns}`);
    try {
      this.removeColumns()
    } catch (error) {  }
    this.fillColumns();
  }

  public fillColumns(): void {
    const divImages = this.elementRef.nativeElement.querySelector('.images');
    const columns: HTMLElement[] = Array.from(
      divImages.querySelectorAll('.column')
    );
    const columnHeights: number[] = new Array(columns.length).fill(0);

    this.exampleImages.forEach((imageUrl) => {
      const image = new Image();
      image.src = imageUrl;
      image.style.width = '14.5rem';
      image.style.borderRadius = '10px';

      // Find the column with the minimum height
      const minHeight = Math.min(...columnHeights);

      // Find the index of the column with the minimum height
      const columnIndex = columnHeights.indexOf(minHeight);

      // Create a new container for the image
      const imageContainer = document.createElement('div');
      imageContainer.style.display = 'flex';
      imageContainer.classList.add('image-container');
      imageContainer.appendChild(image);

      // Add the image container to the column with the minimum height
      columns[columnIndex].appendChild(imageContainer);

      // Update the height of the column with the added image
      columnHeights[columnIndex] += image.clientHeight;
    });
  }

  public removeColumns(): void {
    const divImages = this.elementRef.nativeElement.querySelector('.images');
    const columns: HTMLElement[] = Array.from(
      divImages.querySelectorAll('.column')
    );
    columns.forEach((column: HTMLElement) => {
      while (column.firstChild) {
        column.removeChild(column.firstChild);
      }
    });
  }
}
