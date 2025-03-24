import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentMethodWashoPage } from './payment-method-washo.page';

describe('PaymentMethodWashoPage', () => {
  let component: PaymentMethodWashoPage;
  let fixture: ComponentFixture<PaymentMethodWashoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodWashoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
