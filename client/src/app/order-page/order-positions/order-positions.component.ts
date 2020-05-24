import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Position } from '../../shared/interfaces';
import { OrderService } from '../order.service';
import { MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>

  constructor(private route: ActivatedRoute,
              private positionService: PositionsService,
              private order: OrderService) { }

  ngOnInit() {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params:Params) => {
            return this.positionService.fetch(params['id'])
          }
        ),
        map((positions: Position[]) => {
          return positions.map(position => {
            position.quantity = 1
            return position
          })
        })


      )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Added x${position.quantity}`)
    this.order.add(position)
  }

}
