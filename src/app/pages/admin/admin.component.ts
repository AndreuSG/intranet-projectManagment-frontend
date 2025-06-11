import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BackButtonComponent } from "../../shared/components/back-button/back-button.component";
import { SearchBarComponent } from "../../shared/components/search-bar/search-bar.component";
import { TableComponent } from "../../shared/components/table/table.component";
import { Button } from "primeng/button";
import { Student } from '../../models/interfaces/student.interface';
import { ModuleSelectorComponent } from "../../components/admin/module-selector/module-selector.component";
import { CourseFilterComponent } from "../../shared/components/course-filter/course-filter.component";
import { StudentService } from '../../api/student/student.service';
import { CommonModule } from '@angular/common';
import { ConfigSetterComponent } from "../../components/admin/config-setter/config-setter.component";
import { ButtonComponent } from "../../shared/components/button/button.component";

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [
    CommonModule,
    MatIconModule,
    BackButtonComponent,
    SearchBarComponent,
    TableComponent,
    ModuleSelectorComponent,
    CourseFilterComponent,
    ConfigSetterComponent,
    ButtonComponent,
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  students: Student[] = [];
  courses: string[] = [];
  filteredStudents: Student[] = [...this.students];
  selectedStudents: Student[] = [];

  searchQuery: string = '';
  selectedCourse: string = '';

  loading!: boolean;

  selectModulesModal = false;
  configSetterModal = false;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.findStudents();
  }

  findStudents() {
    this.loading = true;

    this.studentService.findAll().subscribe(students => {
      this.courses = [...new Set(students.map(student => student.course))];
      this.students = students;
      this.filteredStudents = [...students];
      this.loading = false;
    });
  }

  unenrollStudents() {
    this.studentService.unsubscribeStudents({ idalus: this.selectedStudents.map(student => student.idalu)}).subscribe(() => {
      this.students = this.students.filter(student => !this.selectedStudents.includes(student));
      this.filteredStudents = [...this.students];
      this.selectedStudents = [];
    });
  }

  onConfirmModules() {
    this.selectModulesModal = false;
    this.findStudents();
  }

  onConfirmConfig() {
    this.configSetterModal = false;
  }

  onFilter(value: string) {
    this.selectedCourse = value;
    this.applyFilters();
  }

  // Método de búsqueda
  onSearch(value: string) {
    this.searchQuery = value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearch = this.searchQuery
      ? student.nom_complet.toLowerCase().includes(this.searchQuery) ||
        student.email.toLowerCase().includes(this.searchQuery) ||
        student.idalu.toString().includes(this.searchQuery)
      : true;

      const matchesCourse = (this.selectedCourse === 'Tots els cursos' || !this.selectedCourse)
      ? true
      : student.course === this.selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }
}
