import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeWasherPage } from './home-washer.page';

describe('HomeWasherPage', () => {
  let component: HomeWasherPage;
  let fixture: ComponentFixture<HomeWasherPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeWasherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
