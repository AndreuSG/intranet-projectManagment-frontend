import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Study } from '../../../models/enums/study.enum';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Button } from 'primeng/button';
import { StudyService } from '../../../api/study/study.service';

@Component({
  selector: 'shared-study-filter',
  imports: [
    Button,
    MatMenuModule,
    CommonModule,
    Menu,
  ],
  templateUrl: './study-filter.component.html',
  styleUrl: './study-filter.component.scss'
})
export class StudyFilterComponent {
  @Output()
  studySelected = new EventEmitter<string>();

  @Input()
  studies: Study[] = [];

  defaultStudy: string = 'Tots els estudis';
  selectedStudy: string = this.defaultStudy;
  studiesList!: MenuItem[];

  constructor(private studyService: StudyService) {
    this.initStudiesList();
  }

  private async getStudies(): Promise<void> {
    return new Promise(resolve => {
      this.studyService.findByTeacher().subscribe(studies => {
        this.studies = studies;
        resolve();
      });
    })
  }

  private async initStudiesList() {
    await this.getStudies();
    this.studiesList = [this.selectedStudy, ...this.studies].map(item => {
      if (item === this.defaultStudy) {
        return { label: item, disabled: true, command: () => this.studyFilter(item) }
      }
      return { label: item, command: () => this.studyFilter(item) }
    });
  }

  studyFilter(study: string) {
    this.selectedStudy = study;

    this.studiesList.map(item => item.disabled = false);
    this.studiesList.find(item => item.label === study)!.disabled = true;

    this.studySelected.emit(study);
  }
}
