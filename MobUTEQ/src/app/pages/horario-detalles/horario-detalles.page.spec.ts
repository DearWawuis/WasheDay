import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorarioDetallesPage } from './horario-detalles.page';

describe('HorarioDetallesPage', () => {
  let component: HorarioDetallesPage;
  let fixture: ComponentFixture<HorarioDetallesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioDetallesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
