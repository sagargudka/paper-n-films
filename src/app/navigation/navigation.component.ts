import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ItemComponent } from '../inventory/item/item.component';
import { CustomerComponent } from '../customer/customer.component';
import { Authentication } from '../providers/authentication.provider';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isAuthenticated;
  userImage;
  userName;
  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private authentication: Authentication
  ) { }

  ngOnInit() {
    this.authentication.isAuthenticated
      .subscribe(res => {
        this.isAuthenticated = res;
        this.getUserDetails();
      })
  }

  login() {
    this.authentication.authenticate();
  }

  logout() {
    this.authentication.logout();
    this.getUserDetails();
  }

  getUserDetails() {
    this.userImage = this.authentication.getImage();
    this.userName = this.authentication.getName();
  }

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

  editItemDialog(): void {
    let dialogRef = this.dialog.open(ItemComponent, {
      // width: "500px",
      data: {
        isEditMode: true,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result, 'Edit Item', {
          duration: 3000
        });
      }
    });
  }

  addCustomerDialog(): void {
    let dialogRef = this.dialog.open(CustomerComponent, {
      data: null,
      height: '1000px',
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result, 'Add Customer', {
          duration: 3000
        });
      }
    });
  }

  editCustomerDialog() {
    let dialogRef = this.dialog.open(CustomerComponent, {
      data: { editMode: true },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result, 'Edit Customer successfully done', {
          duration: 3000
        });
      }
    });
  }
}
