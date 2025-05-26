import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Module, ModuleWithCourse } from '../../../models/interfaces/module.interface';
import { ModuleService } from '../../../api/module/module.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Select } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { Study } from '../../../models/enums/study.enum';
import { InputText } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { forkJoin } from 'rxjs';
import { CourseService } from '../../../api/course/course.service';
import { Course } from '../../../models/interfaces/course.interface';
@Component({
  selector: 'app-module-selector',
  imports: [
    DialogModule,
    ButtonModule,
    TableModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    Select,
    TooltipModule,
    InputText,
  ],
  templateUrl: './module-selector.component.html',
  styleUrl: './module-selector.component.scss'
})
export class ModuleSelectorComponent implements OnInit {

  @ViewChild('dt1') dt1!: Table;

  @Output() onConfirm = new EventEmitter<void>();

  modules: Module[] = [];
  studies: { estudis: Study }[] = [];
  courses: Course[] = [];
  modulesCourses: ModuleWithCourse[] = [];

  selectedModules!: ModuleWithCourse[];
  selectedCourse: string | undefined;

  visible: boolean = true;
  loading: boolean = true;

  constructor(
    private moduleService: ModuleService,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.moduleService.findConfirmedModules().subscribe(selectedModules => {
      this.selectedModules = this.modulesCourses.filter(m => selectedModules.some(sm => sm.idcurriculum === m.idcurriculum && sm.idmodul === m.idmodul && sm.course === m.course));
    });
  }

  loadData() {
    forkJoin({
      modules: this.moduleService.findAll(),
      courses: this.courseService.findAll(),
    }).subscribe(({ modules, courses }) => {
      this.studies = [...new Set(modules.map(m => m.estudis))].map(estudis => ({ estudis }));
      this.modulesCourses = this.assignCoursesToModules(modules, courses);
      this.loading = false;
    });
  }

  assignCoursesToModules(modules: Module[], courses: Course[]): ModuleWithCourse[] {
    const result: ModuleWithCourse[] = [];

    for (const module of modules) {
      const matchedCourses = courses.filter(course => course.estudis === module.estudis && module.curs === 2);

      for (const course of matchedCourses) {
        result.push({
          ...module,
          course: course.id,
          code: course.id + '_' + module.idmodul
        });
      }
    }

    return result;
  }

  confirmModules(): void {
    this.moduleService.confirmModules(this.selectedModules.map(({ idmodul, idcurriculum, course }) => ({ idmodul, idcurriculum, course }))).subscribe(() => {
      this.onConfirm.emit();
    });
  }

  isValidSelection(): boolean {
    if (!this.selectedModules || this.selectedModules.length === 0) return false;

    const studyCount = new Map<string, number>();

    for (const module of this.selectedModules) {
        studyCount.set(module.course, (studyCount.get(module.course) || 0) + 1);
        if (studyCount.get(module.course)! > 1) return false; // Si hay más de un módulo del mismo estudio, retorna false
    }

    const selectedStudies = new Set(this.selectedModules.map(m => m.course));
    const allStudies = new Set(this.modulesCourses.map(m => m.course));

    return selectedStudies.size === allStudies.size;
  }

  onFilterName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.dt1.filter(inputElement.value, 'nom', 'contains');
    }
  }
}
