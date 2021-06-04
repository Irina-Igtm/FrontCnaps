import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEmployeursComponent } from './details-employeurs.component';

describe('DetailsEmployeursComponent', () => {
  let component: DetailsEmployeursComponent;
  let fixture: ComponentFixture<DetailsEmployeursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsEmployeursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsEmployeursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
