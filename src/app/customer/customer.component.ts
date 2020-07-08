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
    contactName: '',
    tin: '',
    pan: '',
    vat: '',
    email: '',
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

    this.getClients();
  }

  getClients() {
    this.pnfApiService.getClients()
      .subscribe(res => {
        this.existingClients = res;
      });
  }

  ngOnInit() { }

  createCustomer() {
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

      this.getClients();
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
      this.dialogRef.close(`Client ${this.client.name} successfully edited`);
      this.getClients();
    });
  }

  selectionChanged(event) {
    this.client = event.value;
    this.client.contactName = this.client.contactName || '';
    this.client.vat = this.client.vat || '';
    this.client.tin = this.client.tin || '';
    this.client.pan = this.client.pan || '';
    this.client.email = this.client.email || '';
  }

  close() {
    this.dialogRef.close();
  }
}
