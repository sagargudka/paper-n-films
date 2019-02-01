import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MyOwnCustomMaterialModule } from './app-material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { GridComponent } from './inventory/grid/grid.component';
import { PnfApiService } from './service/pnf-api.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  AddStockComponent,
  ItemComponent
} from './inventory/item/item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillComponent } from './orders/bill/bill.component';
import { AppComponent } from './app.component';
import { CustomerComponent } from './customer/customer.component';
import { OrderbookComponent } from './orders/orderbook/orderbook.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    GridComponent,
    AddStockComponent,
    ItemComponent,
    BillComponent,
    CustomerComponent,
    OrderbookComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MyOwnCustomMaterialModule,
    NgbModule.forRoot(),
    NgbModule
  ],
  entryComponents: [
    AddStockComponent,
    ItemComponent,
    BillComponent,
    CustomerComponent,
    OrderbookComponent
  ],
  providers: [HttpClient, PnfApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
