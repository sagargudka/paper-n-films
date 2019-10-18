import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item, Client, Order } from '../models/pnf-api-model';

@Injectable()
export class PnfApiService {
  apiUrl: string = 'https://glacial-tor-53820.herokuapp.com';
  //'https://glacial-tor-53820.herokuapp.com'; //'http://localhost:5000'; // "http://192.168.1.106:5000";
  constructor(private http: HttpClient) {}

  getItems(): Observable<Array<Item>> {
    return this.http.get<Array<Item>>(`${this.apiUrl}/items`);
  }

  addStock(item: { id?: string; quantity?: number }): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/items/${item.id}/stock/${item.quantity}`,
      {}
    );
  }

  addItem(item: Item): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/items`, item);
  }

  editItem(item: Item): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/items/${item.id}`, item);
  }

  getClients(): Observable<Array<Client>> {
    return this.http.get<Array<Client>>(`${this.apiUrl}/clients`);
  }

  createBill(order: Order): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/order`, order);
  }

  addClient(client: Client): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/client`, client);
  }

  editClient(client: Client): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/client/${client.id}`, client);
  }

  getOrders(): Observable<Array<Order>> {
    return this.http.get<Array<Order>>(`${this.apiUrl}/orders`);
  }

  downloadBill(id): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/download?id=${id}`);
  }
}
