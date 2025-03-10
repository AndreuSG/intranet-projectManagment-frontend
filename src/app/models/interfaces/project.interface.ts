import { Study } from "../enums/study.enum";
import { Attachment } from "./attachment.interface";

export interface ProjectList {
  centre: Project[];
  alumns: Project[];  
}

export interface Project {
  id?: number;
  titol: string;
  creatPer: number;
  estudi: Study;
  dataInici: Date;
  dataFi: Date;
  attachments?: Attachment[];
}

export interface ProjectDetail extends Project {
  descripcio: string;
  creationDate: Date;
  lastUpdated: Date | null;
}

export interface StudentProject extends ProjectDetail {
  alumnesIds: number[];
}


