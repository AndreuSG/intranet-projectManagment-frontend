import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, map } from 'rxjs';
import { Config } from '../../models/interfaces/config.interface';
import { API_URLS } from '../../shared/api-routes.const';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private apiService: ApiService) { }

  findAll(): Observable<Config[]> {
    return this.apiService.get(API_URLS.CONFIG).pipe(map(res => res as Config[]));
  }

  findOneByCode(code: string): Observable<Config> {
    return this.apiService.get(`${API_URLS.CONFIG}/${code}`).pipe(map(res => res as Config));
  }

  update(configs: Config[]): Observable<Config[]> {
    return this.apiService.put(API_URLS.CONFIG, configs).pipe(map(res => res as Config[]));
  }

  set(code: string, value: JSON): Observable<Config> {
    return this.apiService.post(`${API_URLS.CONFIG}/${code}`, value).pipe(map(res => res as Config));
  }
}
