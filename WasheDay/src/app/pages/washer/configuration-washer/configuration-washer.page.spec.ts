import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigurationWasherPage } from './configuration-washer.page';

describe('ConfigurationWasherPage', () => {
  let component: ConfigurationWasherPage;
  let fixture: ComponentFixture<ConfigurationWasherPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationWasherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
