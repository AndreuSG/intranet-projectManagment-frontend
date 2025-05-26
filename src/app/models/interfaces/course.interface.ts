import { Study } from "../enums/study.enum";

export interface Course {
  id: string;
  estudis: Study;
  curs: number;
  grup: string;
  tutor: number;
  mostrar: boolean;
}