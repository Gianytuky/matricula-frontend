import { Routes } from '@angular/router';
import { Inicio } from './componentes/inicio/inicio';
import { MatriculaComponent } from './componentes/matricula/matricula';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'matricula', component: MatriculaComponent },
  { path: '**', redirectTo: '' }
];