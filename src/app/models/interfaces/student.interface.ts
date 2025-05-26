import { Study } from "../enums/study.enum";

export interface Student {
  id: number;
  idalu: string;
  nom_complet: string;
  email: string;
  estudis: Study;
  course: string;
}
