import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestCreateNewDocumentDTO } from '../../models/dtos/request-create-new-document.dto';
import { RequestUpdateDocumentDTO } from '../../models/dtos/request-update-document.dto';
import { Document } from '../../models/domains/document';
import { PhaseEnum } from '../../models/enums/phase.enum';
import { Page } from 'src/app/models/interface/page';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/documents';

  constructor(private http: HttpClient) {}


  createDocument(body: RequestCreateNewDocumentDTO): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}`, body);
  }


  updateDocument(id: string, body: RequestUpdateDocumentDTO): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, body);
  }

  getDocumentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateDocumentPhase(id: string, newPhase: PhaseEnum): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}/phase/${newPhase}`, {});
  }

  cloneDocumentById(id: string): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}/clone-document`, {});
  }

  listDocuments(page: number = 0, size: number = 10, phase: PhaseEnum | string = null, title: string, acronym:string): Observable<Page<Document>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (phase !== null && phase !== "TODOS") {
      params = params.set('phase', phase.toString());
    }
    if(title !== null && title.trim() != ""){
      params = params.set('title', title);
    }
    if(acronym !== null && acronym.trim() != ""){
      params = params.set('acronym', acronym.toUpperCase());
    }
    return this.http.get<Page<Document>>(`${this.apiUrl}/list`, { params });
  }

}
