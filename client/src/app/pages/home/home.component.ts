import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface DialogData {
  drawInProgress: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  options = [
    {
      icon              : 'add',
      message           : 'Créer un nouveau dessin',
      dialogCloseResult : 'new',
      canDisplay        : true,
    },
    {
      icon              : 'photo_library',
      message           : 'Aller à la galerie',
      dialogCloseResult : 'library',
      canDisplay        : true,
    },
    {
      icon              : 'menu_book',
      message           : 'Guide d\'utilisation',
      dialogCloseResult : 'documentation',
      canDisplay        : true,
    },
    {
      icon              : 'save',
      message           : 'Continuer un ancien dessin',
      dialogCloseResult : 'continue',
      canDisplay        : true,
    },
  ]

  constructor(public dialogRef: MatDialogRef<HomeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.options[3].canDisplay = data.drawInProgress;
  }

}
