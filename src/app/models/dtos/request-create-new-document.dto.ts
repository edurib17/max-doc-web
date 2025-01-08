export class RequestCreateNewDocumentDTO {
  title: string;
  description: string;
  acronym: string;

  constructor(title: string, description: string, acronym: string) {
    this.title = title;
    this.description = description;
    this.acronym = acronym;
  }
}
