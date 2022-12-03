import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InlineFormFields } from 'src/app/types/inline-form.interface';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-inline-form',
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './inline-form.component.html',
  styleUrls: ['./inline-form.component.scss'],
  standalone: true,
})
export class InlineFormComponent implements OnInit {
  @Input() fields!: InlineFormFields;
  @Input() hasButton = true;
  @Output() handleSubmit = new EventEmitter();
  @Input() alwaysEditting = false;
  isEditting = false;
  controls: Record<string, FormControl> = {};

  form = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.alwaysEditting) {
      this.isEditting = true;
    }

    this.fields.forEach((field) => {
      const validators = [];
      if (field['required']) {
        validators.push(Validators.required);
      }
      if (field['minLength']) {
        validators.push(Validators.minLength(field['minLength']!));
      }
      const control = new FormControl('', validators);
      if (field['defaultValue']) {
        control.patchValue(field['defaultValue']);
      }
      this.controls[field['name']] = control;
      this.form.addControl(field['name'], control);
    });
  }

  activeEditting() {
    if (!this.isEditting) {
      this.isEditting = true;
    }
  }

  cancel(event: Event) {
    event.preventDefault();
    if (!this.alwaysEditting) {
      this.isEditting = false;
    }
    this.form.reset();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.dirty) {
      this.handleSubmit.emit(this.form.value);
    }
    if (!this.alwaysEditting) {
      this.isEditting = false;
    }
    this.form.reset();
  }
}
