import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { API_URLS } from '../../shared/api-routes.const';
import { Schedule } from '../../models/interfaces/schedule.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends ApiService {

  findAll(): Observable<Schedule[]> {
    return this.get(API_URLS.SCHEDULE).pipe(map(res => res as Schedule[]));
  }
}
