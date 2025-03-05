import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnglishScorePage } from './english-score.page';

describe('EnglishScorePage', () => {
  let component: EnglishScorePage;
  let fixture: ComponentFixture<EnglishScorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishScorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

