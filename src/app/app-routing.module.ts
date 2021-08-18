import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationsComponent } from './components/applications/applications.component';
import { ResumesComponent } from './components/applications/toolbar/resumes/resumes.component';

const routes: Routes = [
  { path: "", redirectTo: "applications", pathMatch: "full" },
  { path: "applications", component: ApplicationsComponent },
  { path: "resumes", component: ResumesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
