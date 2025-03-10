import { Component, Input, OnInit } from '@angular/core';
import { Study } from '../../../../models/enums/study.enum';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Select, SelectChangeEvent } from 'primeng/select';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { StudyService } from '../../../../api/study/study.service';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { NgIf } from '@angular/common';
import { StudentService } from '../../../../api/student/student.service';
import { Student } from '../../../../models/interfaces/student.interface';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';


@Component({
  selector: 'project-form',
  imports: [
    ReactiveFormsModule, 
    InputTextModule, 
    FloatLabelModule, 
    Select, 
    ButtonComponent, 
    DatePickerModule, 
    MessageModule, 
    NgIf, 
    MultiSelectModule, 
    FormsModule
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent {
  formGroup!: FormGroup;

  validStudies: Study[] = [];

  students: SelectItem<number>[] = [];
  studentsLoading: boolean = false;
  selectedIds: number[] = [];

  @Input()
  tab: 'school' | 'student' = 'school';

  constructor(
    private ref: DynamicDialogRef,
    private studyService: StudyService,
    private studentService: StudentService,
  ) {
    this.studyService.findByTeacher().subscribe({
      next: (studies) => {
        this.validStudies = studies;
      },
      error: (error) => {
        this.validStudies = Object.values(Study);
      }
    });    
  }

  ngOnInit() {
    this.buildFormGroup();
  }

  getStudentsByStudy(event: SelectChangeEvent) {
    const { value: study } = event;
    this.studentsLoading = true;

    this.studentService.findByStudy(study).subscribe({
      next: (students) => {
        this.students = students.map(student => (
          {
            label: student.nom_complet,
            value: student.id
          }
        ));
        this.studentsLoading = false;
      },
      error: () => {
        this.studentsLoading = false;
      }
    })
  }

  private buildFormGroup(): void {
    this.formGroup = new FormGroup({
      titol: new FormControl<string>('', [Validators.required]),
      estudi: new FormControl<Study | null>(null, [Validators.required, this.validCourseValidator.bind(this)]),
      dataIniciFinal: new FormControl<Date[] | null>(null, [Validators.required, this.startDateValidator.bind(this)]),
    });

    if (this.tab === 'student') {
      this.formGroup.addControl('alumnesIds', new FormControl<Student[]>([], [Validators.required]));
    }
  }

  private validCourseValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.validStudies.includes(control.value)) {
      return { invalidCourse: true };
    }
    return null;
  }

  private startDateValidator(control: AbstractControl): ValidationErrors | null {
    const dateRange = control.value as Date[];

    if (!dateRange || dateRange.length < 2) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateRange[0] < today) {
      return { minDate: true };
    }

    return null;
  }

  saveProject(): void {
    if (this.formGroup.valid) {
      this.ref.close(this.formGroup.value);
    }
  }
}
