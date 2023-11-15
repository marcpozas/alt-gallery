import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() isLanding: boolean = false;
  userInput: string = '';
  placeholder: string = 'Fluffy seal on the snow';

  constructor(private router: Router) {  }

  @Output() searchImages = new EventEmitter<string[]>();

  public onSearch(): void {
    console.log(this.userInput);
    const termsArray = this.userInput.trim().split(/[ ,.]+/);
    const searchTerm = termsArray.join(' ');
    console.log(termsArray);
    this.userInput = "";
    if (termsArray.length > 0 && termsArray[0] !== '') {
      this.router.navigate(['/gallery', searchTerm]);
    }
  }
}
