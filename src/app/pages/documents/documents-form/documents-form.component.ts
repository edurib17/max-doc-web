import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PhaseEnum } from 'src/app/models/enums/phase.enum';
import { DocumentService } from '../documents.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Document } from 'src/app/models/domains/document';
import { RequestCreateNewDocumentDTO } from 'src/app/models/dtos/request-create-new-document.dto';
import { RequestUpdateDocumentDTO } from 'src/app/models/dtos/request-update-document.dto';

@Component({
  selector: 'app-documents-form',
  templateUrl: './documents-form.component.html',
  styleUrls: ['./documents-form.component.css'],
})
export class DocumentsFormComponent implements OnInit {
  form: FormGroup;
  phases = Object.values(PhaseEnum);
  mode: string = '';
  documentId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      id: ['', false],
      title: ['', Validators.required],
      description: ['', Validators.required],
      version: [{ value: 1, disabled: true }, false],
      acronym: [{ value: '', disabled: false }, Validators.required],
      phase:  [{ value: PhaseEnum.MINUTA, disabled: true }, false],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.mode = params['mode'];
      this.documentId = params['id'];

      if (['edit', 'view'].includes(this.mode)) {
        this.form.get('acronym')?.disable();
        this.getOne();

        if (this.mode === 'view') {
          this.form.get('title')?.disable();
          this.form.get('description')?.disable();
        }
      } else if (this.mode === 'create') {
        this.form.get('acronym')?.enable();
        this.phases = [PhaseEnum.MINUTA];
      }
    });
  }


  getOne(): void {
    this.isLoading = true;
    this.documentService.getDocumentById(this.documentId).subscribe({
      next: (data: Document) => {
        this.form.reset(data);
        this.isLoading = false;
      },
      error: () => {
        console.error('Erro ao carregar documentos');
        this.isLoading = false;
        this.showErrorToast('Erro ao carregar documento. Tente novamente.');
      },
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      let document: Document = this.form.value;
      if (this.mode === 'create') {
        this.createNewDocument(document);
      }
      if(this.mode === "edit"){
        this.editNewDocument(document);
      }
    } else {
      console.log('Formulário inválido');
    }
  }

  createNewDocument(document: Document): void {
    const requestBody: RequestCreateNewDocumentDTO = {
      title: document.title,
      acronym: document.acronym,
      description: document.description,
    };
    this.isLoading = true;
    this.documentService.createDocument(requestBody).subscribe({
      next: (response) => {
        this.showSuccessToast("Documento Salvo Com Sucesso!");
        setTimeout(()=>{
          this.router.navigate(['']);
          this.isLoading = false;
        }, 1000)
      },
      error: (error) => {
        console.error('Erro ao criar documento:', error);
        this.showErrorToast(error.error.message);
        this.isLoading = false;
      },
    });
  }

  editNewDocument(document: Document): void {
    const requestBody: RequestUpdateDocumentDTO = {
      title: document.title,
      description: document.description,
    };
    this.isLoading = true;
    this.documentService.updateDocument(document.id,requestBody).subscribe({
      next: (response) => {
        this.showSuccessToast("Documento atualizado com sucesso!");
        setTimeout(()=>{
          this.router.navigate(['']);
          this.isLoading = false;
        }, 1000)
      },
      error: (error) => {
        console.error('Erro ao atualizar documento:', error);
        this.showErrorToast(error.error.message);
        this.isLoading = false;
      },
    });
  }

  onCancel() {
    this.router.navigate(['']);
  }

  private showErrorToast(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-toast'],
    });
  }


  private showSuccessToast(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-toast'],
    });
  }
}
