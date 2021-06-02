import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccuseReceptionComponent } from './accuse-reception.component';

describe('AccuseReceptionComponent', () => {
  let component: AccuseReceptionComponent;
  let fixture: ComponentFixture<AccuseReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccuseReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccuseReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
