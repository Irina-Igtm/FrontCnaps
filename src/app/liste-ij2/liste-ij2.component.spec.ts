import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeIJ2Component } from './liste-ij2.component';

describe('ListeIJ2Component', () => {
  let component: ListeIJ2Component;
  let fixture: ComponentFixture<ListeIJ2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeIJ2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeIJ2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
