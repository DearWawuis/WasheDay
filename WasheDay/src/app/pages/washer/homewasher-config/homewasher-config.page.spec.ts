import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomewasherConfigPage } from './homewasher-config.page';

describe('HomewasherConfigPage', () => {
  let component: HomewasherConfigPage;
  let fixture: ComponentFixture<HomewasherConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomewasherConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
