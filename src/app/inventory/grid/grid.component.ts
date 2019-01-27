import { Component, OnInit, ViewChild } from '@angular/core';
import { Item } from '../../models/pnf-api-model';
import { PnfApiService } from '../../service/pnf-api.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  constructor(private service: PnfApiService) {}
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.service.getItems().subscribe(res => {
      this.dataSource = new MatTableDataSource<Item>(res);
      this.dataSource.paginator = this.paginator;
    });
  }

  displayedColumns = ['hsnCode', 'name', 'description', 'quantity'];
  dataSource = new MatTableDataSource<Item>(ELEMENT_DATA);

  getColor(element: Item) {
    if (element.quantity < element.thresholdUnit) {
      return 'red';
    }
    return 'rgba(0,0,0,.87)';
  }
}

const ELEMENT_DATA: Item[] = [
  {
    id: '1',
    basePrice: 100,
    name: 'Glossy Paper A4',
    type: 'commodity',
    hsnCode: '12345',
    thresholdUnit: 100,
    description: 'Glossy Paper A4 size',
    quantity: 50,
    taxSlab: 8,
    unit: 'sheet'
  },
  {
    id: '1',
    basePrice: 100,
    name: 'Glossy Paper A4',
    type: 'commodity',
    hsnCode: '12346',
    thresholdUnit: 100,
    description: 'Glossy Paper A4 size',
    quantity: 500,
    taxSlab: 8,
    unit: 'sheet'
  }
];
