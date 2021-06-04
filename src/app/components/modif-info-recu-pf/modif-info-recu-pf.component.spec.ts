import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifInfoRecuPfComponent } from './modif-info-recu-pf.component';

describe('ModifInfoRecuPfComponent', () => {
  let component: ModifInfoRecuPfComponent;
  let fixture: ComponentFixture<ModifInfoRecuPfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifInfoRecuPfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifInfoRecuPfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
