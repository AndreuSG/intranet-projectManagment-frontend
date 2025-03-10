import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { API_URLS } from '../../shared/api-routes.const';
import { map } from 'rxjs';
import { Student } from '../../models/interfaces/student.interface';
import { Study } from '../../models/enums/study.enum';

@Injectable({
  providedIn: 'root'
})
export class StudentService extends ApiService {
  findAll() {
    return this.get(API_URLS.STUDENTS).pipe(map(res => res as Student[]));
  }

  findByStudy(study: Study) {
    return this.get(`${API_URLS.STUDENTS_BY_STUDY}/${study}`).pipe(map(res => res as Student[]));
  }

  unsubscribeStudents(data: { idalus: string[] }) {
    return this.put(API_URLS.UNSUBSCRIBE_STUDENTS, data);
  }
}
