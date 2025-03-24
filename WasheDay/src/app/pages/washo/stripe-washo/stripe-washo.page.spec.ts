import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StripeWashoPage } from './stripe-washo.page';

describe('StripeWashoPage', () => {
  let component: StripeWashoPage;
  let fixture: ComponentFixture<StripeWashoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeWashoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
