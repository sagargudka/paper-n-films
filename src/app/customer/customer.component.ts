import { Component, OnInit, Inject } from '@angular/core';
import { Client } from '../models/pnf-api-model';
import { PnfApiService } from '../service/pnf-api.service';
import * as _ from 'underscore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  editMode: false;
  existingClients: Array<Client>;
  client: Client = {
    name: '',
    gstNumber: '',
    address: [
      { addressLine: '', state: '', city: '', pincode: '' },
      { addressLine: '', state: '', city: '', pincode: '' },
      { addressLine: '', state: '', city: '', pincode: '' },
    ],
    phoneNumber: ''
  };

  addressColumns = ['addressLine', 'state', 'city', 'pincode'];

  constructor(
    private pnfApiService: PnfApiService,
    public dialogRef: MatDialogRef<CustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.editMode) {
      this.editMode = data.editMode;
    } else {
      this.editMode = false;
    }

    this.pnfApiService.getClients()
      .subscribe(res => {
        console.log(res);
        this.existingClients = res;
      })
  }

  ngOnInit() { }

  createCustomer() {
    console.log(this.client);

    let index = _.findIndex(
      this.client.address,
      address => address.addressLine === ''
    );
    if (index > -1) {
      this.client.address.splice(index, this.client.address.length - index);
    }

    this.pnfApiService.addClient(this.client).subscribe(res => {
      console.log(res);
      this.dialogRef.close(`Client ${this.client.name} successfully created`);
    });
  }

  editCustomer() {
    let index = _.findIndex(
      this.client.address,
      address => address.addressLine === ''
    );
    if (index > -1) {
      this.client.address.splice(index, this.client.address.length - index);
    }

    this.pnfApiService.editClient(this.client).subscribe(res => {
      console.log(res);
      this.dialogRef.close(`Client ${this.client.name} successfully edited`);
    });
  }

  selectionChanged(event) {
    this.client = event.value;
  }

  close() {
    this.dialogRef.close();
  }
}
