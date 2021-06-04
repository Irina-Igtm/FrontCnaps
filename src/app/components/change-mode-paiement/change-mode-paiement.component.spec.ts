import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeModePaiementComponent } from './change-mode-paiement.component';

describe('ChangeModePaiementComponent', () => {
  let component: ChangeModePaiementComponent;
  let fixture: ComponentFixture<ChangeModePaiementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeModePaiementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeModePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
