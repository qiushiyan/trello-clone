import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InlineFormField } from 'src/app/types/inline-form.interface';
import { InputComponent } from '../input/input.component';
import { BoardService } from 'src/app/services/board.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inline-oneline-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './inline-oneline-form.component.html',
  styleUrls: ['./inline-oneline-form.component.scss'],
})
export class InlineOnelineFormComponent implements OnInit, OnDestroy {
  @Input() field!: InlineFormField;
  @Input() type: 'board' | 'task' | 'column' = 'board';
  @Input() defaultValue = '';
  @Output() handleSubmit = new EventEmitter();
  isEditting = false;
  control!: FormControl;
  form = new FormGroup({});
  subscription: Subscription | null = null;

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    const validators = [];
    if (this.field['required']) {
      validators.push(Validators.required);
    }
    if (this.field['minLength']) {
      validators.push(Validators.minLength(this.field['minLength']!));
    }
    this.control = new FormControl('', validators);
    if (this.field['defaultValue']) {
      this.control.patchValue(this.field['defaultValue']);
    }
    this.form.addControl(this.field['name'], this.control);

    if (this.defaultValue !== '') {
      this.control.patchValue(this.defaultValue);
    } else {
      // fetch for default value
      switch (this.type) {
        case 'board':
          this.subscription = this.boardService.board$.subscribe((board) => {
            if (board) {
              const fieldName = this.field.name as keyof typeof board;
              this.control.patchValue(board[fieldName]);
            }
          });
          break;
        default:
          break;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.form.valid) {
      this.handleSubmit.emit(this.form.value);
      this.isEditting = false;
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
    this.form.reset();
  }
}
