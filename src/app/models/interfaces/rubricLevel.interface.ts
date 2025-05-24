// Interfaz para un nivel de logro asociado a un criteri
export interface RubricLevel {
    id?: number;
    criteriId: number;
    nom: string;
    descripcio?: string;
    puntuacio: number;
}
