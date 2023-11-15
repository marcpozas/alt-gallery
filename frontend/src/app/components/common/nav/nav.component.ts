import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  constructor(private dialog: MatDialog) {}

  openEnterDialog(mode: string): void {
    const dialogConfig: MatDialogConfig = {
      autoFocus: true,
      width: '40rem',
      height: 'fit-content',
      disableClose: false,
      panelClass: "loginDialog",
      data: {
        mode: mode
      }
    };
    const dialogRef: MatDialogRef<LoginComponent> = this.dialog.open(LoginComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
