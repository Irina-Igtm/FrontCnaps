import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsIj2Component } from './details-ij2.component';

describe('DetailsIj2Component', () => {
  let component: DetailsIj2Component;
  let fixture: ComponentFixture<DetailsIj2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsIj2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsIj2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
