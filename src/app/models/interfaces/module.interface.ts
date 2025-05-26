import { Study } from "../enums/study.enum";

export interface Module {
  idmodul: number;
  idcurriculum: number;
  curriculum: string;
  estudis: Study;
  sigles: string;
  curs: number;
  nom: string;
}

export interface SelectedModule {
  idmodul: number;
  idcurriculum: number;
  course: string;
}

export interface ModuleWithCourse extends Module {
  course: string;
  code?: string;
}