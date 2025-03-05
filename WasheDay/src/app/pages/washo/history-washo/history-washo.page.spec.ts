import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryWashoPage } from './history-washo.page';

describe('HistoryWashoPage', () => {
  let component: HistoryWashoPage;
  let fixture: ComponentFixture<HistoryWashoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryWashoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
