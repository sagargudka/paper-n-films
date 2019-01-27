import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { PnfApiService } from "../../service/pnf-api.service";
import * as _ from "underscore";
import { Item } from "../../models/pnf-api-model";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.css"]
})
export class ItemComponent implements OnInit {
  item: Item = {
    basePrice: 0,
    type: "product",
    hsnCode: "",
    name: "",
    thresholdUnit: 0,
    description: "",
    quantity: 0,
    taxSlab: 5,
    unit: ""
  };
  action: string = "Add Item";
  isfieldEditable: Boolean = true;

  itemTypes = ["product", "service"];
  taxSlabs = [5, 12, 18, 28];
  constructor(
    private pnfApiService: PnfApiService,
    public dialogRef: MatDialogRef<ItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item
  ) {
    if (data) {
      this.item = data;
      this.action = "Edit Item";
      this.isfieldEditable = false;
    }
  }

  ngOnInit() {}

  add() {
    this.pnfApiService
      .addItem(this.item)
      .subscribe(
        res =>
          this.dialogRef.close(`${res.name} stock was successfully added.`),
        err => this.dialogRef.close(err.error)
      );
  }

  close() {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-item",
  templateUrl: "./add-stock.component.html",
  styleUrls: ["./item.component.css"]
})
export class AddStockComponent implements OnInit {
  itemList: Array<{ id: string; name: string }>;
  item: { id: string; quantity: number };
  constructor(
    private pnfApiService: PnfApiService,
    public dialogRef: MatDialogRef<AddStockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.item = {
      id: "",
      quantity: 0
    };
  }

  ngOnInit() {
    this.pnfApiService.getItems().subscribe(items => {
      this.itemList = _.map(items, item => {
        return {
          id: item.id,
          name: item.name
        };
      });
    });
  }

  addStock() {
    if (this.item.id && this.item.quantity) {
      this.pnfApiService
        .addStock(this.item)
        .subscribe(
          res =>
            this.dialogRef.close(
              `${res.name} stock was successfully updated. New stock is ${
                res.quantity
              }`
            ),
          err => this.dialogRef.close(err.error)
        );
    }
  }
  close() {
    this.dialogRef.close();
  }
}
