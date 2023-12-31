import { ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  imagesArray = [];
  page = 1;
  pageSize = 10;
  loading = false;

  constructor(private route: ActivatedRoute,
              private imageService: ImageService,
              private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchTerms = params['searchTerms'];
      this.results["search"] = this.searchTerms;
      this.imageService.searchImages(this.page, 10, this.searchTerms).subscribe((results) => {
        this.imagesArray = this.imagesArray.concat(results);
      });
    });
  }

  ngAfterViewChecked() {
    this.calculateColumns();
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight && !this.loading) {
      this.page++;
      this.loadImages();
    }
  }

  loadImages() {
    this.loading = true;
    this.imageService.searchImages(this.page, this.pageSize, this.searchTerms)
      .subscribe((results) => {
        this.imagesArray = this.imagesArray.concat(results);
        this.loading = false;
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateColumns();
  }

  calculateColumns() {
    const windowWidth = window.innerWidth;
    if (windowWidth < 750 && this.columns != 1) {
      this.columns = 1;
    } else if (windowWidth >= 750 && windowWidth < 1130 && this.columns != 2) {
      this.columns = 2;
    } else if (windowWidth >= 1130 && windowWidth < 1550 && this.columns != 3){
      this.columns = 3;
    } else if (windowWidth >= 1550 && windowWidth < 1900 && this.columns != 4){
      this.columns = 4;
    } else if (windowWidth >= 1900 && windowWidth < 3000 && this.columns != 5){
      this.columns = 5;
    }
    try {
      this.removeColumns()
    } catch (error) {  }
    this.fillColumns();
  }

  public fillColumns(): void {
    console.log("fsfsd");
    const divImages = this.elementRef.nativeElement.querySelector('.images');
    const columns: HTMLElement[] = Array.from(
      divImages.querySelectorAll('.column')
    );
    const columnHeights: number[] = new Array(columns.length).fill(0);

    this.imagesArray.forEach((imageUrl) => {
      const image = new Image();
      image.src = imageUrl["imageLink"];
      image.style.width = '18rem';
      image.style.borderRadius = '10px';
      // Find the column with the minimum height
      const minHeight = Math.min(...columnHeights);
      // Find the index of the column with the minimum height
      const columnIndex = columnHeights.indexOf(minHeight);
      // Title creation
      const pTitle = document.createElement('p');
      pTitle.textContent = imageUrl["title"];
      pTitle.style.margin = '0.5rem 0';
      pTitle.style.fontFamily = 'OpenSans';
      pTitle.style.textIndent = '0.5rem';
      // User creation
      // const pUser = document.createElement('p');
      // pUser.textContent = imageUrl["user"];
      // Create a new container for the image
      const imageContainer = document.createElement('div');
      imageContainer.style.display = 'flex';
      imageContainer.style.flexDirection = 'column';
      imageContainer.classList.add('image-container');
      imageContainer.appendChild(image);
      imageContainer.appendChild(pTitle);
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
