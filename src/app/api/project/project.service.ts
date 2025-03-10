import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { map, Observable } from 'rxjs';
import { Project, ProjectDetail, ProjectList, StudentProject } from '../../models/interfaces/project.interface';
import { API_URLS } from '../../shared/api-routes.const';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends ApiService {
  findAll(): Observable<ProjectList> {
    return this.get(API_URLS.PROJECTS).pipe(map((res) => res as ProjectList));
  }

  findById(id: number, type: 'school' | 'student'): Observable<ProjectDetail> {
    const route = type === 'school' ? API_URLS.SCHOOL_PROJECTS : API_URLS.STUDENT_PROJECTS;
    return this.get(`${route}/${id}`).pipe(map((res) => res as ProjectDetail));
  }

  create(project: Project | StudentProject, type: 'school' | 'student'): Observable<Project> {
    const route = type === 'school' ? API_URLS.SCHOOL_PROJECTS : API_URLS.STUDENT_PROJECTS;
    return this.post(route, project).pipe(map((res) => res as Project));
  }

  update(project: ProjectDetail): Observable<ProjectDetail> {
    return this.put(`${API_URLS.PROJECTS}/${project.id}`, project).pipe(map((res) => res as ProjectDetail));
  }
}
