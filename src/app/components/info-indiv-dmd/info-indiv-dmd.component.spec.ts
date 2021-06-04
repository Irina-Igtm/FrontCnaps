import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoIndivDmdComponent } from './info-indiv-dmd.component';

describe('InfoIndivDmdComponent', () => {
  let component: InfoIndivDmdComponent;
  let fixture: ComponentFixture<InfoIndivDmdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoIndivDmdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoIndivDmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
