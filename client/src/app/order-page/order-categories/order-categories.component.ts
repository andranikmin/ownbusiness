import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs';

import { CategoriesServer } from 'src/app/shared/services/categories.service';
import { Category } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.css']
})
export class OrderCategoriesComponent implements OnInit {

  categories$: Observable<Category[]>

  constructor(private categoriesService: CategoriesServer) { }

  ngOnInit() {
    this.categories$ = this.categoriesService.fetch()
  }

}
