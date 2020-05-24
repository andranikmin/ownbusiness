import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { AnalyticsServics } from '../shared/services/analytics.service'
import { AnalyticsPage, AnalyticsChartItem } from '../shared/interfaces'
import {Chart} from 'chart.js'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain', {static: true}) gainRef: ElementRef
  @ViewChild('order', {static: true}) orderRef: ElementRef

  sub: Subscription
  average: number
  pending = true

  constructor(private service: AnalyticsServics) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Profit',
      color: 'rgb(255, 99, 132)'
    }

    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    }
    this.sub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average
      const chart = data.chart
      gainConfig.labels = chart.map((item: AnalyticsChartItem) => item.label)
      gainConfig.data = chart.map((item: AnalyticsChartItem) => item.gain)

      orderConfig.labels = chart.map((item: AnalyticsChartItem) => item.label)
      orderConfig.data = chart.map((item: AnalyticsChartItem) => item.order)

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, this.createChartConfig(gainConfig))
      new Chart(orderCtx, this.createChartConfig(orderConfig))
      this.pending = false
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  createChartConfig({labels, data, label, color}) {
    return {
      type: 'line',
      options: {
        responsive: true
      },
      data: {
        labels,
        datasets: [
          {
            label,
            data,
            borderColor: color,
            steppedLine: false,
            fill: false
          }
        ]
      }
    }
  }
}
