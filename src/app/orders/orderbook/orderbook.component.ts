import { Component, OnInit, ViewChild } from '@angular/core';
import { PnfApiService } from '../../service/pnf-api.service';
import { Order } from '../../models/pnf-api-model';
import * as _ from 'underscore';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./orderbook.component.css']
})
export class OrderbookComponent implements OnInit {
  orderDataSource: MatTableDataSource<Order>;
  orderColumns = [
    'id',
    'date',
    'type',
    'client',
    'items',
    'paymentLeft',
    'amount'
  ];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  monthYearList: string[] = [];
  selectedMonthYear = 'none';
  originalOrderSource: Array<Order>;
  selectedClient = 'none';
  clientList: string[] = [];
  productsList: string[] = [];
  selectedProduct = 'none';

  constructor(private pnfApiService: PnfApiService) {
    this.pnfApiService.getOrders().subscribe(res => {
      console.log(res);
      this.originalOrderSource = res;

      _.each(res, order => {
        const monthYear = moment(order.date, 'DD/MM/YYYY').format('MMMM, YYYY');
        this.monthYearList = _.union(this.monthYearList, [monthYear]);

        this.clientList = _.union(this.clientList, [order.client.name]);

        const items = [];
        _.each(order.items, item => {
          if (item.quantity) {
            items.push(item.name);
          }
        });
        this.productsList = _.union(this.productsList, items);
      });

      this.initializeDataSource(res);
    });
  }

  getTotal() {
    let total = 0;
    if (this.orderDataSource) {
      _.each(this.orderDataSource.data, order => {
        total += Number(order.total.grossAmount);
      });
    }

    return total.toFixed(2);
  }

  filter() {
    let newDataSource = JSON.parse(JSON.stringify(this.originalOrderSource));
    if (
      this.selectedMonthYear !== undefined ||
      (this.selectedMonthYear &&
        this.selectedMonthYear.toLowerCase() !== 'none')
    ) {
      newDataSource = _.filter(newDataSource, order => {
        const monthYear = moment(order.date, 'DD/MM/YYYY').format('MMMM, YYYY');
        return monthYear === this.selectedMonthYear;
      });
    }

    if (this.selectedClient && this.selectedClient.toLowerCase() !== 'none') {
      newDataSource = _.filter(newDataSource, order => {
        return order.client.name === this.selectedClient;
      });
    }
    if (this.selectedProduct && this.selectedProduct.toLowerCase() !== 'none') {
      newDataSource = _.filter(newDataSource, order => {
        const pr = _.find(
          order.items,
          item => item.name === this.selectedProduct
        );
        return pr ? true : false;
      });
    }

    this.initializeDataSource(newDataSource);
  }

  initializeDataSource(source) {
    const newSource: Array<Order> = JSON.parse(JSON.stringify(source));
    this.orderDataSource = new MatTableDataSource<Order>(newSource);
    this.orderDataSource.paginator = this.paginator;
  }
  ngOnInit() { }
}
