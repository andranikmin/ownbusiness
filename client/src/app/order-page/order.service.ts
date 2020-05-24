import { Injectable } from '@angular/core';
import { Position, OrderPosition } from '../shared/interfaces';

@Injectable()
export class OrderService {

  list: OrderPosition[] = []
  price = 0

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    })

    const condidate = this.list.find(p => p._id === orderPosition._id)

    if (condidate) {
      condidate.quantity += orderPosition.quantity
    } else {
      this.list.push(orderPosition)
    }

    this.calcPrice()
  }

  remove(orderPosition: OrderPosition) {

    const idx = this.list.findIndex(p => p._id === orderPosition._id)
    this.list.splice(idx, 1)
    this.calcPrice()
  }

  clear() {
    this.list = []
    this.price = 0
  }

  calcPrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0)
  }
 }
