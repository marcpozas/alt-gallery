import { ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  title: string = "";
  biography: string = "Lorem ipsum alo fmgs sk lfdds";
  username: string = "";
  results: { numberImages: number; search: string } = {numberImages: 0, search: ""};
  columns: number = 3;
  imagesArray = [];
  page = 1;
  pageSize = 10;
  loading = false;

  constructor(private route: ActivatedRoute,
              private imageService: ImageService,
              private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) {  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.imageService.searchUserImages(this.page, this.pageSize, this.username).subscribe((results) => {
        console.log(results);
        this.imagesArray = this.imagesArray.concat(results);
      });
    });
  }

  ngAfterViewChecked() {
    this.calculateColumns();
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.calculateColumns();
      this.changeDetectorRef.detectChanges();
    }, 500);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight &&
      !this.loading
    ) {
      this.page++;
      this.loadImages();
    }
  }

  loadImages() {
    this.loading = true;
    this.imageService.searchUserImages(this.page, this.pageSize, this.username)
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
    const divImages = this.elementRef.nativeElement.querySelector('.images');
    const columns: HTMLElement[] = Array.from(
      divImages.querySelectorAll('.column')
    );
    const columnHeights: number[] = new Array(columns.length).fill(0);

    this.imagesArray.forEach((imageUrl) => {
      const image = new Image();
      image.src = imageUrl;
      image.style.width = '18rem';
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
