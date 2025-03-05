import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeWashoPage } from './home-washo.page';

describe('HomeWashoPage', () => {
  let component: HomeWashoPage;
  let fixture: ComponentFixture<HomeWashoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeWashoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
