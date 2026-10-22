import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatriculaService } from '../../servicios/matricula';

@Component({
  selector: 'app-matricula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matricula.html',
  styleUrl: './matricula.css'
})
export class MatriculaComponent implements OnInit {
  especialidades: any[] = [];
  cursos: any[] = [];
  alumnos: any[] = [];

  codEspecialidadSel: string = '';
  cursoSel: any = null;
  vista: string = 'cursos';

  apenom: string = '';
  tipo: string = '';
  pago: number = 0;
  mensaje: string = '';

  constructor(
    private matriculaServicio: MatriculaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.matriculaServicio.getEspecialidades().subscribe({
      next: (data) => {
        this.especialidades = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar especialidades:', err)
    });
  }

  onSeleccionarEspecialidad(): void {
    if (!this.codEspecialidadSel) {
      this.cursos = [];
      return;
    }
    this.matriculaServicio.getCursosPorEspecialidad(this.codEspecialidadSel).subscribe({
      next: (data) => {
        this.cursos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar cursos:', err)
    });
  }

  verAlumnos(curso: any): void {
    this.cursoSel = curso;
    this.vista = 'alumnos';
    this.limpiarFormulario();
    this.cargarListaAlumnos(curso.codcur);
  }

  cargarListaAlumnos(codcur: string): void {
    this.matriculaServicio.getAlumnosPorCurso(codcur).subscribe({
      next: (data) => {
        this.alumnos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar alumnos:', err)
    });
  }

  calcularPago(): void {
    if (!this.cursoSel) return;
    const costo = this.cursoSel.costo;
    if (this.tipo === '1') {
      this.pago = costo * 0.5;
    } else if (this.tipo === '2') {
      this.pago = costo * 0.75;
    } else if (this.tipo === '3') {
      this.pago = costo;
    } else {
      this.pago = 0;
    }
  }

  guardarMatricula(): void {
    if (!this.apenom || !this.tipo) {
      this.mensaje = 'Por favor complete todos los campos';
      return;
    }

    const payload = {
      codcur: this.cursoSel.codcur,
      apenom: this.apenom,
      tipo: this.tipo,
      pago: this.pago
    };

    this.matriculaServicio.adicionarMatricula(payload).subscribe({
      next: (res) => {
        if (res.ok) {
          this.mensaje = 'Matrícula guardada exitosamente';
          this.limpiarFormulario();
          this.cargarListaAlumnos(this.cursoSel.codcur);
          this.matriculaServicio.getCursoPorId(this.cursoSel.codcur).subscribe(c => this.cursoSel = c);
        } else {
          this.mensaje = res.mensaje;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al matricular:', err)
    });
  }

  borrarAlumno(nromat: string): void {
    if (confirm('¿Seguro de anular la matrícula de este alumno?')) {
      this.matriculaServicio.eliminarMatricula(nromat).subscribe({
        next: (res) => {
          this.cargarListaAlumnos(this.cursoSel.codcur);
          this.matriculaServicio.getCursoPorId(this.cursoSel.codcur).subscribe(c => this.cursoSel = c);
        },
        error: (err) => console.error('Error al borrar:', err)
      });
    }
  }

  limpiarFormulario(): void {
    this.apenom = '';
    this.tipo = '';
    this.pago = 0;
    this.mensaje = '';
  }

  volver(): void {
    this.vista = 'cursos';
    this.onSeleccionarEspecialidad();
  }
}