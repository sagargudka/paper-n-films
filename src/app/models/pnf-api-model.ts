import { assertPreviousIsParent } from '@angular/core/src/render3/instructions';

export class Item {
  id?: string;
  basePrice: number;
  type: string;
  hsnCode: string;
  name: string;
  thresholdUnit: number;
  description: string;
  quantity: number;
  taxSlab: number;
  unit: string;
}

export class OrderItem {
  id?: string;
  basePrice: number;
  type: string;
  hsnCode: string;
  name: string;
  description: string;
  availableQuantity: number;
  quantity: number;
  taxSlab: number;
  unit: string;
  amount: ItemAmount;

  constructor() {
    this.basePrice = 0;
    this.type = 'product';
    this.hsnCode = '';
    this.name = '';
    this.description = '';
    this.availableQuantity = 0;
    this.quantity = 0;
    this.taxSlab = 0;
    this.unit = '';
    this.amount = new ItemAmount();
  }
}

class Tax {
  percent: number;
  value: number;

  constructor() {
    this.percent = 0;
    this.value = 0;
  }

  calculate(percent, amount) {
    this.percent = percent;
    this.value = Number(((amount * percent) / 100).toFixed(2));
  }
}

class ItemAmount {
  netAmount: number; // netAmount = rate x unit
  grossAmount: number; // amount after calculating the taxes
  cgst: Tax;
  sgst: Tax;
  igst: Tax;

  constructor() {
    this.netAmount = 0;
    this.grossAmount = 0;
    this.cgst = new Tax();
    this.sgst = new Tax();
    this.igst = new Tax();
  }

  calculateItemAmount(
    taxSlab: number,
    basePrice: number,
    quantity: number,
    isInterState: boolean,
    isBill: boolean
  ) {
    // This functionupdates the entire ItemAmount Object
    this.netAmount = Number((basePrice * quantity).toFixed(2));

    if (!isBill) {
      this.igst.calculate(0.0, this.netAmount);
      this.cgst.calculate(0.0, this.netAmount);
      this.sgst.calculate(0.0, this.netAmount);
    } else if (!isInterState) {
      this.igst.calculate(0.0, this.netAmount);
      this.cgst.calculate(taxSlab / 2, this.netAmount);
      this.sgst.calculate(taxSlab / 2, this.netAmount);
    } else {
      this.igst.calculate(taxSlab, this.netAmount);
      this.cgst.calculate(0.0, this.netAmount);
      this.sgst.calculate(0.0, this.netAmount);
    }

    this.grossAmount =
      this.netAmount + this.cgst.value + this.sgst.value + this.igst.value;
    this.grossAmount = Number(this.grossAmount.toFixed(2));
  }
}

export interface Order {
  id?: string;
  date: string;
  type: string;
  client: Client;
  items: OrderItem[];
  total: {
    netAmount: number;
    transportCharges: number;
    cgst: number;
    sgst: number;
    igst: number;
    roundedBy: number;
    grossAmount: number;
    paymentGiven: number;
    paymentLeft: number;
  };
}

export interface Address {
  addressLine: string;
  pincode: string;
  city: string;
  state: string;
}

export interface Client {
  id?: string;
  name: string;
  address: Array<Address>;
  gstNumber: string;
  phoneNumber?: string;
}
