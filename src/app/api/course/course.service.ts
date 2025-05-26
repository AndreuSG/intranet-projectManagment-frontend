import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { map, Observable } from 'rxjs';
import { Course } from '../../models/interfaces/course.interface';
import { API_URLS } from '../../shared/api-routes.const';

@Injectable({
  providedIn: 'root'
})
export class CourseService extends ApiService {
  findAll(): Observable<Course[]> {
    return this.get(API_URLS.COURSES).pipe(map(res => res as Course[]));
  }
}
