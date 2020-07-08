import { Component, OnInit, ViewChild, Input } from '@angular/core';
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

  @Input('refreshItems') set refreshItems(value) {
    this.setItems();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    setTimeout(() => this.setItems(), 500);
  }

  setItems() {
    this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource<Item>(this.service.itemList);
    this.dataSource.paginator = this.paginator;
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

const ELEMENT_DATA: Item[] = [];
