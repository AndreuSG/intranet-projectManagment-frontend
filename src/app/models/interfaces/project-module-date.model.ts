export interface ProjectModuleDate {
  id: number;
  idModul: number;
  idProfe: number;
  idGrup: string;
  dataInici: string;
}

export interface CreateProjectModuleDate {
  idModul: number;
  idProfe: number;
  idGrup: string;
  dataInici: string;
}

export interface UpdateProjectModuleDate {
  idModul?: number;
  idProfe?: number;
  idGrup?: string;
  dataInici?: string;
}
