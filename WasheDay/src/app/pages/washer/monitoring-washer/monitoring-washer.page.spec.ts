import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitoringWasherPage } from './monitoring-washer.page';

describe('MonitoringWasherPage', () => {
  let component: MonitoringWasherPage;
  let fixture: ComponentFixture<MonitoringWasherPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringWasherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
