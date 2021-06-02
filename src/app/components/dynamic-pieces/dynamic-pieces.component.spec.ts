import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPiecesComponent } from './dynamic-pieces.component';

describe('DynamicPiecesComponent', () => {
  let component: DynamicPiecesComponent;
  let fixture: ComponentFixture<DynamicPiecesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicPiecesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPiecesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
