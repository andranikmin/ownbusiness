import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Order } from 'src/app/shared/interfaces';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnChanges, OnDestroy, AfterViewInit {

  @ViewChild('modal', {static: true}) modalRef: ElementRef
  modal: MaterialInstance
  @Input() orders: Order[]
  selectedOrder: Order
  price: number

  ngOnChanges() {
    this.calcPrice()
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  calcPrice() {
    this.orders.forEach(order => {
     order.price = order.list.reduce((total, item) => {
        return total += item.quantity * item.cost
      }, 0)
    });
  }

  selectOrder(order: Order) {
      this.selectedOrder = order
      this.modal.open()
  }

  closeModal() {
    this.modal.close()
  }
}
