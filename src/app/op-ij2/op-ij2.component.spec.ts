import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpIj2Component } from './op-ij2.component';

describe('OpIj2Component', () => {
  let component: OpIj2Component;
  let fixture: ComponentFixture<OpIj2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpIj2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpIj2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
