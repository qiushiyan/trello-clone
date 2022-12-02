import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-inline-form',
  imports: [CommonModule],
  templateUrl: './inline-form.component.html',
  styleUrls: ['./inline-form.component.scss'],
  standalone: true,
})
export class InlineFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() placeholder: string = 'not defined';
  @Input() hasButton = false;
  @Input() buttonText = 'Submit';
  @Output() handleSubmit = new EventEmitter();

  isEditting = false;

  toggleEditting() {
    this.isEditting = !this.isEditting;
  }

  constructor() {}

  ngOnInit(): void {}
}
