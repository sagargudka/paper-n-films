import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ItemComponent } from '../inventory/item/item.component';
import { CustomerComponent } from '../customer/customer.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor(public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {}

  addItemDialog(): void {
    let dialogRef = this.dialog.open(ItemComponent, {
      // width: "500px",
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result, 'Add Item', {
          duration: 3000
        });
      }
    });
  }

  addCustomerDialog(): void {
    let dialogRef = this.dialog.open(CustomerComponent, {
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result, 'Add Customer', {
          duration: 3000
        });
      }
    });
  }
}
