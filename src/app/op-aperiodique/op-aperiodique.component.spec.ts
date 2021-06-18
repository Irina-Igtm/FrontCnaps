import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpAperiodiqueComponent } from './op-aperiodique.component';

describe('OpAperiodiqueComponent', () => {
  let component: OpAperiodiqueComponent;
  let fixture: ComponentFixture<OpAperiodiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpAperiodiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpAperiodiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
