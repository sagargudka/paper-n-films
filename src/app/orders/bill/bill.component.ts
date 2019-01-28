import { Component, OnInit, Inject } from '@angular/core';
import { PnfApiService } from '../../service/pnf-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  Order,
  Client,
  Address,
  Item,
  OrderItem
} from '../../models/pnf-api-model';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as _ from 'underscore';
import saveAs from 'save-as';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  clientCtrl: any;
  clientList: Array<Client> = [];
  filteredClientList: Observable<Array<Client>>;
  vendorState = 'Maharashtra';
  apiItemList: Item[] = [
    {
      name: 'Sagar',
      description: 'Some decscription about the product',
      unit: 'sheets',
      id: '12345',
      hsnCode: '123',
      type: 'product',
      basePrice: 50,
      quantity: 5,
      taxSlab: 5,
      thresholdUnit: 1
    },
    {
      name: 'Krina',
      type: 'product',
      description: 'abc',
      unit: 'sheets',
      id: '12345',
      hsnCode: '123',
      basePrice: 50,
      quantity: 6,
      taxSlab: 12,
      thresholdUnit: 1
    }
  ];

  addressList: Array<Address> = [{ state: '', addressLine: '', city: '', pincode: '' }];
  selectedAddressLine = '';
  selectedAddressState = '';
  selectedAddressCity = '';
  selectedAddressPincode = '';
  selectedItemQuantity = 0;

  errorMessage: string[] = [];
  itemColumns = [
    'name',
    'hsnCode',
    'unit',
    'availableQuantity',
    'quantity',
    'x',
    'basePrice',
    'netAmount',
    'cgst',
    'sgst',
    'igst',
    'total'
  ];
  itemChallanColumns = [
    'name',
    'hsnCode',
    'unit',
    'availableQuantity',
    'quantity',
    'x',
    'basePrice',
    'total'
  ];
  itemsDataSource: Array<OrderItem> = [
    new OrderItem(),
    new OrderItem(),
    new OrderItem(),
    new OrderItem(),
    new OrderItem()
  ];

  order: Order = {
    id: '',
    date: '',
    type: 'bill',
    client: {
      id: '',
      name: '',
      address: [
        {
          addressLine: '',
          state: '',
          city: '',
          pincode: ''
        },
        {
          addressLine: '',
          state: '',
          city: '',
          pincode: ''
        }
      ],
      gstNumber: '',
      phoneNumber: ''
    },
    items: [],
    total: {
      netAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      grossAmount: 0,
      roundedBy: 0,
      transportCharges: 0,
      paymentGiven: 0,
      paymentLeft: 0
    }
  };
  constructor(
    private pnfApiService: PnfApiService,
    public dialogRef: MatDialogRef<BillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type?: string; order?: Order }
  ) {
    this.clientCtrl = new FormControl();
    if (data) {
      if (data.type) {
        this.order.type = data.type;
      }
    }

    this.filteredClientList = this.clientCtrl.valueChanges.pipe(
      startWith(''),
      map(
        client =>
          client ? this.filterClients(client) : this.clientList.slice()
      )
    );
  }

  filterClients(value) {
    const filterValue = value.toLowerCase();

    return this.clientList.filter(
      client => client.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  clientChanged(data) {
    this.clientCtrl.value += data;
    const clt: Client = _.find(this.clientList, client => client.name === data);
    this.addressList = clt.address;
    this.order.client.address[0].addressLine = this.addressList[0].addressLine;
    this.order.client.address[0].state = this.addressList[0].state;
    this.order.client.address[0].city = this.addressList[0].city || '';
    this.order.client.address[0].pincode = this.addressList[0].pincode || '';

    this.selectedAddressLine = this.addressList[0].addressLine;
    this.selectedAddressState = this.addressList[0].state;
    this.selectedAddressCity = this.addressList[0].city || '';
    this.selectedAddressPincode = this.addressList[0].pincode || '';

    this.order.client.gstNumber = clt.gstNumber;
    this.order.client.id = clt.id;
    this.order.client.name = clt.name;
    this.order.client.phoneNumber = clt.phoneNumber;
  }

  addressChanged(selectedAddressLine) {
    let newAdd = _.find(
      this.addressList,
      address => address.addressLine === selectedAddressLine
    );

    this.selectedAddressState = newAdd.state;
    this.selectedAddressCity = newAdd.city || '';
    this.selectedAddressPincode = newAdd.pincode || '';

    // Update the item gst values as well.
    _.each(this.itemsDataSource, item => {
      item.amount.calculateItemAmount(
        item.taxSlab,
        item.basePrice,
        item.quantity,
        this.selectedAddressState.toUpperCase() !==
        this.vendorState.toUpperCase(),
        this.order.type === 'bill'
      );
    });

    this.calculateTotal(
      this.order.total.transportCharges,
      this.order.total.paymentGiven
    );
  }

  itemChanged(element: OrderItem, quantity, basePrice) {
    element.quantity = quantity;
    element.basePrice = basePrice;

    element.amount.calculateItemAmount(
      element.taxSlab,
      element.basePrice,
      element.quantity,
      this.selectedAddressState.toUpperCase() !==
      this.vendorState.toUpperCase(),
      this.order.type === 'bill'
    );
    this.calculateTotal(
      this.order.total.transportCharges,
      this.order.total.paymentGiven
    );
  }

  onItemSelect(item: OrderItem) {
    const i: Item = _.find(this.apiItemList, itm => itm.name === item.name);

    item.description = i.description;
    item.hsnCode = i.hsnCode;
    item.basePrice = i.basePrice;
    item.id = i.id;
    item.unit = i.unit;
    item.quantity = 0;
    item.taxSlab = i.taxSlab;
    item.availableQuantity = i.quantity;

    item.amount.calculateItemAmount(
      item.taxSlab,
      item.basePrice,
      item.quantity,
      this.selectedAddressState.toUpperCase() !==
      this.vendorState.toUpperCase(),
      this.order.type === 'bill'
    );
    this.calculateTotal(
      this.order.total.transportCharges,
      this.order.total.paymentGiven
    );
  }

  calculateTotal(transportCharges, paymentGiven) {
    this.order.total = {
      cgst: 0,
      sgst: 0,
      igst: 0,
      netAmount: 0,
      grossAmount: 0,
      transportCharges: transportCharges,
      paymentGiven: paymentGiven,
      paymentLeft: 0,
      roundedBy: 0
    };
    _.each(this.itemsDataSource, item => {
      this.order.total.cgst += item.amount.cgst.value;
      this.order.total.sgst += item.amount.sgst.value;
      this.order.total.igst += item.amount.igst.value;
      this.order.total.grossAmount += item.amount.grossAmount;
      this.order.total.netAmount += item.amount.netAmount;
    });

    this.order.total.grossAmount += this.order.total.transportCharges;

    this.order.total.roundedBy = Number(
      (
        Math.round(this.order.total.grossAmount) - this.order.total.grossAmount
      ).toFixed(2)
    );
    this.order.total.grossAmount += this.order.total.roundedBy;

    this.order.total.paymentLeft +=
      this.order.total.grossAmount - this.order.total.paymentGiven;
  }

  createBill() {
    this.errorMessage = [];
    if (!this.order.client.id || !this.order.items.length) {
      this.errorMessage = ['Please complete all the details'];
    }
    const mom = moment();
    this.order.id = mom.format('YYYYMMDDhhmmss');
    this.order.date = mom.format('DD/MM/YYYY');
    this.order.client.address[1].addressLine = this.selectedAddressLine;
    this.order.client.address[1].state = this.selectedAddressState;
    this.order.client.address[1].city = this.selectedAddressCity || '';
    this.order.client.address[1].pincode = this.selectedAddressPincode || '';

    this.order.items = this.itemsDataSource;

    const index = _.findIndex(this.order.items, item => item.quantity === 0);
    if (index > -1) {
      this.order.items.splice(index, this.order.items.length - index);
    }

    this.pnfApiService.createBill(this.order).subscribe(res => {
      if (res.err) {
        this.errorMessage = res.err;
      } else {
        const buff = new Buffer(res.data.pdf, 'base64');
        // let text = buff.toString('ascii');
        saveAs(new Blob([buff]), `${this.order.id}.pdf`);
        this.dialogRef.close(`Order ${this.order.id} successfully created`);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.pnfApiService.getClients().subscribe(res => {
      this.clientList = res;
    });
    this.pnfApiService.getItems().subscribe(res => {
      this.apiItemList = res;
    });
  }
}
