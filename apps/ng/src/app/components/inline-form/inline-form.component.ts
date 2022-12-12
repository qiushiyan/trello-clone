import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';
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
  @Input() oneLine = false;
  @Input() alwaysEditting = false;
  @Input() fullHeight = false;
  @Input() fullWidth = false;
  @Input() text = '';
  @Input() type!: 'board' | 'task' | 'column';
  @Input() defaultValues: string[] = [];
  @Output() handleSubmit = new EventEmitter();
  isEditting = false;
  wrapperClass = '';

  controls: Record<string, FormControl> = {};

  form = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(() => {
      this.isEditting = false;
    });
  }

  ngOnInit(): void {
    if (this.fullWidth) {
      this.wrapperClass = '';
    } else {
      this.wrapperClass = this.oneLine
        ? 'flex'
        : 'flex justify-center items-center mx-auto';
    }

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

    if (this.defaultValues.length > 0) {
      this.defaultValues.forEach((value, index) => {
        this.controls[this.fields[index]['name']].patchValue(value);
      });
    } else {
      switch (this.type) {
        case 'board':
          this.boardService.board$.subscribe((board) => {
            if (board) {
              this.fields.forEach((field) => {
                const fieldName = field.name as keyof typeof board;
                this.controls[field.name].patchValue(board[fieldName]);
              });
            }
          });
          break;
        default:
          break;
      }
    }
  }

  activeEditting() {
    if (!this.isEditting) {
      this.isEditting = true;
    }
  }

  cancel(event: Event) {
    event.preventDefault();
    this.isEditting = false;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      this.handleSubmit.emit(this.form.value);
      this.isEditting = false;
      this.form.reset();
    }
  }
}
