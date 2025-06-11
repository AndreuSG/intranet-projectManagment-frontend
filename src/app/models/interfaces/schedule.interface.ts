import { Course } from "./course.interface";
import { Module } from "./module.interface";

export interface Schedule {
  id: number;
  assignatura: string;
  currModul: ScheduleModule;
  color: string;
  profe: string;

  grup: string;

  cursGrup: Course;

  aula: string;

  dia: number;

  franja: number;

  ini: number;

  fin: number;
}

export interface ScheduleModule {
  id: number;
  nom: string;
  sigles: string;
  curs: number;
  ordre: number;
}