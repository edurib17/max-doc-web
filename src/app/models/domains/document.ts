import { PhaseEnum } from '../enums/phase.enum';

export class Document {
  id: string;
  title: string;
  description: string;
  version: number;
  acronym: string;
  phase: PhaseEnum;

  constructor(
    id: string,
    title: string,
    description: string,
    version: number,
    acronym: string,
    phase: PhaseEnum
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.version = version;
    this.acronym = acronym.toUpperCase();
    this.phase = phase;
  }
}
