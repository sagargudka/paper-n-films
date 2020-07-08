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
  itemList: Array<Item>;
  isEditMode = false;
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

  itemTypes = ["product", "service"];
  taxSlabs = [5, 12, 18, 28];
  constructor(
    private pnfApiService: PnfApiService,
    public dialogRef: MatDialogRef<ItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.action = "Edit Item";
      this.isEditMode = data.isEditMode;
    }
  }

  selectionItemChanged(event) {
    this.item = event.value;
  }

  ngOnInit() {
    this.pnfApiService.getItems();
    this.itemList = this.pnfApiService.itemList;
  }

  add() {
    this.pnfApiService
      .addItem(this.item)
      .subscribe(
        res =>
          this.dialogRef.close(`${res.name} item was successfully added.`),
        err => this.dialogRef.close(err.error)
      );
  }

  edit() {
    this.pnfApiService
    .editItem(this.item)
    .subscribe(
      res =>
        this.dialogRef.close(`${res.name} item was successfully edited.`),
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
    this.itemList = _.map(this.pnfApiService.itemList, item => {
      return {
        id: item.id,
        name: item.name
      };
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
