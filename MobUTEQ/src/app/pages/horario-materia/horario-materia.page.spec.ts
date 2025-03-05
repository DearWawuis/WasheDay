import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorarioMateriaPage } from './horario-materia.page';

describe('HorarioMateriaPage', () => {
  let component: HorarioMateriaPage;
  let fixture: ComponentFixture<HorarioMateriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioMateriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
