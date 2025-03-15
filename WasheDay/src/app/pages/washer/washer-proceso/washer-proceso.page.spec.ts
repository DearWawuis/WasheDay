import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WasherProcesoPage } from './washer-proceso.page';

describe('WasherProcesoPage', () => {
  let component: WasherProcesoPage;
  let fixture: ComponentFixture<WasherProcesoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WasherProcesoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
