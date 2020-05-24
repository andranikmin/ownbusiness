import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { CategoriesServer } from 'src/app/shared/services/categories.service';
import { of, Observable } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { ThrowStmt } from '@angular/compiler';
import { Category } from 'src/app/shared/interfaces';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('uploadInput', {static: true}) uploadInputRef: ElementRef
  form: FormGroup
  image: File
  imagePreview:any = ''
  isNew = true
  category: Category

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesServer,
              private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }

            return of(null)
          }
        )
      )
      .subscribe(
        (category: Category )=> {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })

            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }

          this.form.enable()
        },
        error => console.error(error)

      )
  }

  triggerClick() {
    this.uploadInputRef.nativeElement.click()
  }

  deleteCategory() {
    const decision = window.confirm(`Are you sure that  you want delete ${this.category.name} category ?`)

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          res => MaterialService.toast(res.message.toString()),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])

        )
    }
  }

  onFileUploade(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit() {
    let obs$: Observable<Category>
    this.form.disable()
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Category has been edited')
      },
      error => {
        MaterialService.toast(error.error.message)
      },
      ()=> {
        this.form.enable()
      }
    )
  }
}
