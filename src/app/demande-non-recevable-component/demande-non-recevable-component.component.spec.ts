import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeNonRecevableComponentComponent } from './demande-non-recevable-component.component';

describe('DemandeNonRecevableComponentComponent', () => {
  let component: DemandeNonRecevableComponentComponent;
  let fixture: ComponentFixture<DemandeNonRecevableComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeNonRecevableComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeNonRecevableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
