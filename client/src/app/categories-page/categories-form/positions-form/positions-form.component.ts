import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { PositionsService } from 'src/app/shared/services/positions.service'
import { Position } from '../../../shared/interfaces'
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.service'
import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string
  @ViewChild('modal', {static: true}) modalRef: ElementRef
  positions: Position[] = []
  loading = false
  positionId = null
  modal: MaterialInstance
  form: FormGroup

  constructor(private positionSrevice: PositionsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })

   this.loading = true
    this.positionSrevice.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions
      this.loading = false
    })
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id
    this.form.setValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onAddPosition() {
    this.positionId = null
    this.form.setValue({
      name: null,
      cost: 1
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onCancel() {
    this.modal.close()
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const decision = window.confirm(`Are you sure that you want delete ${position.name} category item ?`)

    if (decision) {
      this.positionSrevice.delete(position).subscribe(
        res => {
          const idx = this.positions.findIndex( p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(res.message)
        },
        error => MaterialService.toast
      )
    }
  }

  onSubmit() {
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () => {
      this.modal.close()
      this.form.reset({name: '', cost: 1})
      this.form.enable()
    }

    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionSrevice.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex( p => p._id === position._id)
          this.positions[idx] = position
          MaterialService.toast('Position has been edited')
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    } else {
      this.positionSrevice.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Position has been created')
          this.positions.push(position)
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    }
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

}
