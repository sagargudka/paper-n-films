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
  client: Client = {
    name: '',
    gstNumber: '',
    address: [
      { addressLine: '', state: '' },
      { addressLine: '', state: '' },
      { addressLine: '', state: '' }
    ],
    phoneNumber: ''
  };

  addressColumns = ['addressLine', 'state'];

  constructor(
    private pnfApiService: PnfApiService,
    public dialogRef: MatDialogRef<CustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: string }
  ) {}

  ngOnInit() {}

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

  close() {
    this.dialogRef.close();
  }
}
