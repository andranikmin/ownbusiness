import { Component, OnInit } from '@angular/core'
import { CategoriesServer } from '../shared/services/categories.service';
import { Category } from '../shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {

  categories$: Observable<Category[]>

  constructor(private categoriesService: CategoriesServer) { }

  ngOnInit() {
    this.categories$ = this.categoriesService.fetch()
  }
}
