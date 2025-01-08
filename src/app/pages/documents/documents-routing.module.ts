import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { DocumentsFormComponent } from './documents-form/documents-form.component';

const routes: Routes = [
  { path: '', component: DocumentsListComponent },
  { path: 'form/:mode/:id', component: DocumentsFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRoutingModule {}
