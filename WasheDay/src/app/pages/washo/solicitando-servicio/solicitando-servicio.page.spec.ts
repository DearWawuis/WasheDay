import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitandoServicioPage } from './solicitando-servicio.page';

describe('SolicitandoServicioPage', () => {
  let component: SolicitandoServicioPage;
  let fixture: ComponentFixture<SolicitandoServicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitandoServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
