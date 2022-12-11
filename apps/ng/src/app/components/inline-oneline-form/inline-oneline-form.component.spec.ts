import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineOnelineFormComponent } from './inline-oneline-form.component';

describe('InlineOnelineFormComponent', () => {
  let component: InlineOnelineFormComponent;
  let fixture: ComponentFixture<InlineOnelineFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InlineOnelineFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InlineOnelineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
