import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar.component";
import { Student } from '../../../models/interfaces/student.interface';
import { StudentService } from '../../../api/student/student.service';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { ModulesConfigComponent } from "../../../components/teacher/modules-config/modules-config.component";
import { CommonModule } from '@angular/common';
import { ProjectModuleDateService } from '../../../api/projectModuleDates/project-module-dates.service';
import { ProjectModuleDate } from '../../../models/interfaces/project-module-date.model';
import { ModuleService } from '../../../api/module/module.service';
import { Module, SelectedModule } from '../../../models/interfaces/module.interface';
import { CourseService } from '../../../api/course/course.service';
import { Course } from '../../../models/interfaces/course.interface';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ScheduleService } from '../../../api/schedule/schedule.service';
import { Schedule } from '../../../models/interfaces/schedule.interface';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-attendance',
  imports: [
    CommonModule,
    BackButtonComponent,
    // SearchBarComponent,
    ButtonComponent,
    ModulesConfigComponent,
    SelectModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit {
  studentsInModule: Student[] = [];
  filteredStudents: Student[] = [...this.studentsInModule];

  searchQuery: string = '';
  selectedStudy: string = '';

  loading: boolean = false;

  modulesConfigModal = false;

  projectModuleDates: ProjectModuleDate[] = [];
  modules: Module[] = [];

  courses: Course[] = [];
  selectedCourse: Course | null = null;

  selectedDate: Date | null = null;
  selectedFranja: number | null = null;

  selectedModule: Module | null = null;

  schedules: Schedule[] = [];

  availableModules: Module[] = [];
  availableFranges: { label: string; value: number }[] = [];

  constructor(
    // private studentService: StudentService,
    private courseService: CourseService,
    private moduleService: ModuleService,
    private projectModuleDateService: ProjectModuleDateService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {
    this.findStudents();
    this.findCourses();
    this.findModules();
    this.findProjectModuleDates();
    this.findSchedule();
  }

  findStudents() {
    this.loading = true;

    // this.studentService.findAll().subscribe(students => {
    //   this.studentsInModule = students;
    //   this.filteredStudents = [...students];
    //   this.loading = false;
    // });
  }

  findSchedule() {
    this.scheduleService.findAll().subscribe(schedules => {
      this.schedules = schedules;
    });
  }

  findCourses() {
    this.courseService.findAll().subscribe(courses => {
      this.courses = courses;
    });
  }

  findModules() {
    forkJoin({
      projectModuleDates: this.projectModuleDateService.findAll(),
      modules: this.moduleService.findAll(),
    }).subscribe(({ projectModuleDates, modules }) => {
      this.modules = modules.map(module => {
        const foundModule = projectModuleDates.find(m => m.idModul === module.idmodul);
        if (foundModule) return module;
        return null;
      }).filter(Boolean) as Module[];
    });
  }

  findProjectModuleDates() {
    this.projectModuleDateService.findAll().subscribe(projectModuleDates => {
      this.projectModuleDates = projectModuleDates;
    });
  }

  onCourseChange(course: Course) {
    if (!course) return;

    this.selectedCourse = course;
    this.selectedDate = null;
    this.selectedFranja = null;
    this.selectedModule = null;

    const pmForGroup = this.projectModuleDates
      .filter(pmd => pmd.idGrup === course.id)

    this.availableModules = pmForGroup
      .map(pmd => this.modules.find(m => m.idmodul === pmd.idModul))
      .filter((m): m is Module => !!m);

  }

  onDateChange(date: Date) {
    this.selectedDate = date;
    this.selectedFranja = null;
    this.selectedModule = null;

    const jsDay = date.getDay();
    const scheduleDay = (jsDay + 6) % 7;

    const courseId = this.selectedCourse!.id.split(' ').join('');

    const schedFiltered = this.schedules.filter(s =>
      s.grup === (courseId.includes('SMX') ? courseId : courseId.slice(0, -1)) &&
      s.dia === scheduleDay
    ).sort((a, b) => a.franja - b.franja);

    const mapFr = schedFiltered.map(s => ({
      label: `${this.formatTime(s.ini)} – ${this.formatTime(s.fin)}`,
      value: s.franja
    }));

    this.availableFranges = Array.from(
      new Map(mapFr.map(f => [f.value, f])).values()
    );
  }

  onFranjaChange(franja: number): void {
    this.selectedFranja = franja;
    this.selectedModule = null;

    const jsDay = this.selectedDate!.getDay();
    const scheduleDay = (jsDay + 6) % 7;

    const courseId = this.selectedCourse!.id.split(' ').join('');

    const schedFiltered = this.schedules.filter(s =>
      s.grup === (courseId.includes('SMX') ? courseId : courseId.slice(0, -1)) &&
      s.dia === scheduleDay &&
      s.franja === franja
    );

    console.log(schedFiltered);
    console.log(this.modules);

    this.availableModules = schedFiltered
      .map(s => this.modules.find(m => m.idmodul === s.currModul.idmodul))
      .filter((m): m is Module => !!m);
  }

  onConfirmModulesConfig() {
    this.modulesConfigModal = false;
  }

  private formatTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}`;
  }
}
