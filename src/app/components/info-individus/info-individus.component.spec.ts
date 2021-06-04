import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoIndividusComponent } from './info-individus.component';

describe('InfoIndividusComponent', () => {
  let component: InfoIndividusComponent;
  let fixture: ComponentFixture<InfoIndividusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoIndividusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoIndividusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
