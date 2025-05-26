import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Study } from '../../../models/enums/study.enum';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Button } from 'primeng/button';
import { StudyService } from '../../../api/study/study.service';

@Component({
  selector: 'shared-course-filter',
  imports: [
    Button,
    MatMenuModule,
    CommonModule,
    Menu,
  ],
  templateUrl: './course-filter.component.html',
  styleUrl: './course-filter.component.scss'
})
export class CourseFilterComponent implements OnChanges {
  @Output()
  courseSelected = new EventEmitter<string>();

  @Input()
  courses: string[] = [];

  defaultCourse: string = 'Tots els cursos';
  selectedCourse: string = this.defaultCourse;
  coursesList!: MenuItem[];

  ngOnInit() {
    this.initCoursesList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courses']) {
      this.initCoursesList();
    }
  }

  private async initCoursesList() {
    this.coursesList = [this.defaultCourse, ...this.courses].map(item => {
      if (item === this.defaultCourse) {
        return { label: item, disabled: true, command: () => this.courseFilter(item) }
      }
      return { label: item, command: () => this.courseFilter(item) }
    });
  }

  courseFilter(course: string) {
    this.selectedCourse = course;

    this.coursesList.map(item => item.disabled = false);
    this.coursesList.find(item => item.label === course)!.disabled = true;

    this.courseSelected.emit(course);
  }
}
