import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DocumentService } from '../documents.service';
import { Router } from '@angular/router';
import { Document } from '../../../models/domains/document';
import { Page } from '../../../models/interface/page';
import { PhaseEnum } from 'src/app/models/enums/phase.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import _ from 'lodash';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css'],
})
export class DocumentsListComponent implements OnInit {
  documents: Document[] = [];
  displayedColumns: string[] = ['title', 'description', 'acronym', 'phase', 'version', 'action', 'clone'];
  phaseEnum = Object.values(PhaseEnum);
  phaseSelectFilter = null;
  titleFilter = '';
  acronymFilter = '';

  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(private documentService: DocumentService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(page: number = 0, size: number = 10): void {
    this.isLoading = true;
    this.documentService.listDocuments(page, size, this.phaseSelectFilter, this.titleFilter, this.acronymFilter).subscribe({
      next: (data: Page<Document>) => {
        const reorderedData = _.orderBy(data.content, ['acronym','version'], ['asc', 'desc']);
        this.documents = reorderedData;
        this.totalElements = data.totalElements;
        this.pageSize = data.size;
        this.currentPage = data.number;
        this.isLoading = false;
      },
      error: () => {
        console.error('Erro ao carregar documentos');
        this.showErrorToast('Erro ao carregar documentos. Tente novamente.');
        this.isLoading = false;
      },
    });
  }

  onPhaseFilterChange(event: any): void {
    this.phaseSelectFilter = event.target.value
  }

  onClickFilter(): void {
    this.documents = [];
    this.loadDocuments(0, 10);
  }

  clearFilters(): void{
    this.phaseSelectFilter = null;
    this.titleFilter = '';
    this.acronymFilter = '';
    this.loadDocuments(0, 10);

  }

  onPageChange(event: PageEvent): void {
    this.loadDocuments(event.pageIndex, event.pageSize);
  }

  createNewDocument(){
   this.router.navigate(['/documents/form', 'create', '']);
  }

  onPhaseChange(event: any, document: Document): void {
    this.documents = []
     let newPhase:PhaseEnum =  event.target.value
      this.isLoading = true;
      this.documentService.updateDocumentPhase(document.id, newPhase).subscribe({
        next: (response) => {
          this.showSuccessToast("Documento atualizado com sucesso!");
          setTimeout(()=>{
            this.phaseSelectFilter = "TODOS"
            this.loadDocuments()
          },800)
        },
        error: (error) => {
          console.error('Erro ao atualizar documento:', error);
          this.showErrorToast(error.error.message);
          this.phaseSelectFilter = "TODOS"
          this.loadDocuments()
        },
      });
  }

  onCloneDocumentChange(document: Document): void {
    this.documents = []
      this.isLoading = true;
      this.documentService.cloneDocumentById(document.id).subscribe({
        next: (response) => {
          this.showSuccessToast("Nova Versão gerada com sucesso!");
          setTimeout(()=>{
            this.phaseSelectFilter = "TODOS"
            this.loadDocuments()
          },800)
        },
        error: (error) => {
          console.error('Erro ao gerar nova versão:', error);
          this.showErrorToast(error.error.message);
          this.phaseSelectFilter = "TODOS"
          this.loadDocuments()
        },
      });
  }

  editDocument(documentId: string): void {
    this.router.navigate(['/documents/form', 'edit', documentId]);
  }

  viewDocument(documentId: string): void {
    this.router.navigate(['/documents/form', 'view', documentId]);
  }

  getPhasesByDocument(document:Document): PhaseEnum[]{
    if(document.phase == PhaseEnum.MINUTA){
      return [PhaseEnum.MINUTA, PhaseEnum.VIGENTE]
    }

    if(document.phase == PhaseEnum.VIGENTE){
      return [PhaseEnum.VIGENTE,PhaseEnum.OBSOLETO]
    }

    if(document.phase == PhaseEnum.OBSOLETO){
      return [PhaseEnum.OBSOLETO]
    }

    return []
  }

  private showErrorToast(message: string): void {
    this.snackBar.open(
      message,
      'Fechar',
      {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-toast'],
      }
    );
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
