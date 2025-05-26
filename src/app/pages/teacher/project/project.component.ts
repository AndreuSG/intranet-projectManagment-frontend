import { Component, OnDestroy } from '@angular/core';
import { ProjectListComponent } from "../../../components/teacher/projects/project-list/project-list.component";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProjectFormComponent } from '../../../components/teacher/projects/project-form/project-form.component';
import { Project, ProjectList, StudentProject } from '../../../models/interfaces/project.interface';
import { StudyService } from '../../../api/study/study.service';
import { Study } from '../../../models/enums/study.enum';
import { ProjectService } from '../../../api/project/project.service';
import { AuthService } from '../../../auth/auth.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectButtonChangeEvent, SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { StudyFilterComponent } from "../../../shared/components/study-filter/study-filter.component";

@Component({
  selector: 'app-project',
  imports: [
    ProjectListComponent,
    BackButtonComponent,
    SearchBarComponent,
    ButtonComponent,
    PaginatorModule,
    SelectButtonModule,
    FormsModule,
    StudyFilterComponent
],
  providers: [DialogService],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnDestroy {
  tab: 'school' | 'student' = 'school';
  tabs = [
    { label: 'Centre', value: 'school' },
    { label: 'Alumne', value: 'student' },
  ]

  allProjects: ProjectList = { centre: [], alumns: [] };
  schoolProjects: Project[] = [];
  studentProjects: Project[] = [];

  isLoading: boolean = true;

  search: string = '';

  selectedStudy: string = 'Tots els estudis';
  studies: Study[] = [];

  projectFormDialogRef: DynamicDialogRef<ProjectFormComponent> | undefined;

  pageSize: number = 12;
  currentPage: number = 0;

  constructor(
    public dialogService: DialogService,
    private studyService: StudyService,
    private projectService: ProjectService,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    this.loadProjectes();

    this.studyService.findByTeacher().subscribe(studies => {
      this.studies = studies;
    });

    const tab = this.cookieService.get('projectTab') as 'school' | 'student';
    if (tab) {
      this.tab = tab;
    }
  }

  get filteredProjects(): Project[] {
    const projects = this.tab === 'school' ? this.schoolProjects : this.studentProjects;

    return projects
      .filter(project =>
        this.selectedStudy === 'Tots els estudis' || project.estudi === this.selectedStudy
      )
      .filter(project =>
        project.titol.toLowerCase().includes(this.search.toLowerCase())
      );
  }

  get paginatedProjects(): Project[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredProjects.slice(start, start + this.pageSize);
  }

  ngOnDestroy() {
    if (this.projectFormDialogRef) {
      this.projectFormDialogRef.close();
    }
  }

  loadProjectes(): void {
    this.projectService.findAll().subscribe((projects) => {
      this.allProjects = projects;
      this.studentProjects = projects.alumns || [];
      this.schoolProjects = projects.centre || [];
      this.isLoading = false;
    });
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage = event.page!;
  }

  onTabChange(event: SelectButtonChangeEvent): void {
    this.tab = event.value as 'school' | 'student';
    this.cookieService.set('projectTab', this.tab);
  }

  addProject(): void {
    if (this.projectFormDialogRef) return;

    this.projectFormDialogRef = this.dialogService.open(ProjectFormComponent, {
      header: 'Nou projecte',
      width: '400px',
      height: this.tab === 'school' ? '35vh' : '45vh',
      modal: true,
      closable: true,
      inputValues: {
        tab: this.tab,
      }
    });

    this.projectFormDialogRef.onClose.subscribe((result?: Project | StudentProject) => {
      if (result) {
        this.isLoading = true;
        this.projectService.create({ ...result, creatPer: this.authService.getId() }, this.tab).subscribe(() => {
          this.loadProjectes();
        });
      }
      this.projectFormDialogRef = undefined;
    });
  }
}
