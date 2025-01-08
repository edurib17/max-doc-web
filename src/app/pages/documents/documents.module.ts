import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { DocumentsFormComponent } from './documents-form/documents-form.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DocumentsListComponent, DocumentsFormComponent],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DocumentsModule { }
