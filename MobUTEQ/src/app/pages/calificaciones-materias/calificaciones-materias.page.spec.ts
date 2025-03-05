import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalificacionesMateriasPage } from './calificaciones-materias.page';

describe('CalificacionesMateriasPage', () => {
  let component: CalificacionesMateriasPage;
  let fixture: ComponentFixture<CalificacionesMateriasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionesMateriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
