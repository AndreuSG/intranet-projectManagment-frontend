import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import {
  ProjectModuleDate,
  CreateProjectModuleDate,
  UpdateProjectModuleDate
} from '../../models/interfaces/project-module-date.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URLS } from '../../shared/api-routes.const';

@Injectable({
  providedIn: 'root'
})
export class ProjectModuleDateService extends ApiService {
  findAll(): Observable<ProjectModuleDate[]> {
    return this.get(API_URLS.PROJECT_MODULE_DATES).pipe(map(res => res as ProjectModuleDate[]));
  }

  create(data: CreateProjectModuleDate): Observable<ProjectModuleDate> {
    return this.post(API_URLS.PROJECT_MODULE_DATES, data).pipe(map(res => res as ProjectModuleDate));
  }

  update(id: number, data: UpdateProjectModuleDate): Observable<ProjectModuleDate> {
    return this.put(`${API_URLS.PROJECT_MODULE_DATES}/${id}`, data).pipe(map(res => res as ProjectModuleDate));
  }
}
