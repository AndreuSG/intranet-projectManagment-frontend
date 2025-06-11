import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Module } from '../../../models/interfaces/module.interface';
import { ModuleService } from '../../../api/module/module.service';
import { TableModule } from 'primeng/table';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../../api/course/course.service';
import { Course } from '../../../models/interfaces/course.interface';
import { forkJoin, map } from 'rxjs';
import { ConfigService } from '../../../api/config/config.service';
import { dateRangeValidator } from '../../../shared/validators/date-range.validator';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { AuthService } from '../../../auth/auth.service';
import { ProjectModuleDateService } from '../../../api/projectModuleDates/project-module-dates.service';
import { CreateProjectModuleDate, ProjectModuleDate, UpdateProjectModuleDate } from '../../../models/interfaces/project-module-date.model';
import { ModuleWithCourse } from '../../../models/interfaces/module.interface';

@Component({
  selector: 'app-modules-config',
  imports: [
    DialogModule,
    TableModule,
    DatePickerModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modules-config.component.html',
  styleUrl: './modules-config.component.scss'
})
export class ModulesConfigComponent {

  @Output() onConfirm = new EventEmitter<void>();

  formGroup!: FormGroup;
  visible = true;

  modules: Module[] = [];
  courses: Course[] = [];
  modulesCourses: ModuleWithCourse[] = [];
  existingDates: ProjectModuleDate[] = [];


  limitDates: Date[] = [];

  constructor(
    private moduleService: ModuleService,
    private courseService: CourseService,
    private configService: ConfigService,
    private projectModuleDateService: ProjectModuleDateService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    forkJoin({
      courses: this.courseService.findAll(),
      modules: this.moduleService.findAll(),
      limitDates: this.configService.findOneByCode('data_inici_fi_curs').pipe(
        map(({ value }) => JSON.parse(value).map((d: string) => new Date(d)))
      ),
      existingDates: this.projectModuleDateService.findAll(),
    }).subscribe(({ courses, modules, limitDates, existingDates }) => {
      this.courses = courses;
      this.modules = modules;
      this.limitDates = limitDates;
      this.existingDates = existingDates;
      console.log(this.existingDates);

      this.modulesCourses = this.assignCoursesToModules(this.modules, this.courses);
      this.createFormGroup(existingDates);
    });
  }

  createFormGroup(existingDates: ProjectModuleDate[]): void {
    const group: Record<string, FormControl> = {};

    const [min, max] = this.limitDates;

    for (const mc of this.modulesCourses) {
      const controlKey = `${mc.idmodul}_${mc.course}`;
      const matched = existingDates.find(
        d => d.idModul === mc.idmodul && d.idGrup === mc.course
      );

      const control = new FormControl<Date | null>(
        matched ? new Date(matched.dataInici) : null,
        [dateRangeValidator(min, max)]
      );

      control.valueChanges.subscribe(value => {
        if (control.valid && value) {
          this.createOrUpdateProjectModuleDate(mc.idmodul, mc.course, value);
        }
      });

      group[controlKey] = control;
    }

    this.formGroup = new FormGroup(group);
  }

  assignCoursesToModules(modules: Module[], courses: Course[]): ModuleWithCourse[] {
    const result: ModuleWithCourse[] = [];

    for (const module of modules) {
      const matchedCourses = courses.filter(course => course.estudis === module.estudis && module.curs === 2);

      for (const course of matchedCourses) {
        result.push({
          ...module,
          course: course.id
        });
      }
    }

    return result;
  }

  createOrUpdateProjectModuleDate(idModul: number, idGrup: string, dataInici: Date): void {
    const idProfe = this.authService.getId();

    const existing = this.existingDates.find(
      d => d.idModul === idModul && d.idGrup === idGrup
    );

    const payload: CreateProjectModuleDate | UpdateProjectModuleDate = {
      idModul,
      idGrup,
      idProfe,
      dataInici: this.toIsoLocalDate(dataInici)
    };

    if (existing) {
      this.projectModuleDateService.update(existing.id, payload as UpdateProjectModuleDate).subscribe();
    } else {
      this.projectModuleDateService.create(payload as CreateProjectModuleDate).subscribe((projectModuleDate) => {
        this.existingDates.push(projectModuleDate);
      });
    }
  }

  private toIsoLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
