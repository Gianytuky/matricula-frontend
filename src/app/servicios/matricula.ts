import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private apiUrl = 'https://matricula-backend-u8pm.onrender.com/api/v1';

  constructor(private http: HttpClient) {}

  getEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/especialidades`);
  }

  getCursosPorEspecialidad(codesp: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cursos/${codesp}`);
  }

  getCursoPorId(codcur: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/curso/${codcur}`);
  }

  getAlumnosPorCurso(codcur: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alumnos/${codcur}`);
  }

  adicionarMatricula(alumno: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/adiciona`, alumno);
  }

  eliminarMatricula(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/borra/${id}`);
  }
}