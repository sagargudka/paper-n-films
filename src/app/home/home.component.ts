import { Component, OnInit, NgModule } from '@angular/core';
import { AddStockComponent } from '../inventory/item/item.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BillComponent } from '../orders/bill/bill.component';
import { OrderbookComponent } from '../orders/orderbook/orderbook.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {}

  openAddStockDialog(): void {
    let dialogRef = this.dialog.open(AddStockComponent, {
      // width: "500px",
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result, 'Add Stock', {
          duration: 3000
        });
      }
    });
  }

  createBill(): void {
    let dialogRef = this.dialog.open(BillComponent, {
      width: '1000px',
      data: { type: 'bill' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result, 'Create Tax Invoice', {
          duration: 3000
        });
      }
    });
  }

  createChallan(): void {
    let dialogRef = this.dialog.open(BillComponent, {
      width: '1000px',
      data: { type: 'challan' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result, 'Create Challan', {
          duration: 3000
        });
      }
    });
  }

  openOrderBook(): void {
    let dialogRef = this.dialog.open(OrderbookComponent, {
      width: '1000px',
      data: null
    });
  }
}
