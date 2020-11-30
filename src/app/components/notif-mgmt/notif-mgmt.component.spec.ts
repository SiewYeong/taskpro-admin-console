import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifMgmtComponent } from './notif-mgmt.component';

describe('NotifMgmtComponent', () => {
  let component: NotifMgmtComponent;
  let fixture: ComponentFixture<NotifMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
