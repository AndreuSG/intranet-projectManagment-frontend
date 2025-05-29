import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { map, Observable } from 'rxjs';
import { API_URLS } from '../../shared/api-routes.const';

export interface CalendarEvent {
    id?: number;
    title: string;
    description?: string;
    start_time: string;
    end_time?: string;
    color: string;
}

@Injectable({
    providedIn: 'root'
})
export class CalendarService extends ApiService {

    findAll(): Observable<CalendarEvent[]> {
        return this.get(API_URLS.CALENDAR_EVENTS).pipe(map((res) => res as CalendarEvent[]));
    }

    findById(id: number): Observable<CalendarEvent> {
        return this.get(`${API_URLS.CALENDAR_EVENTS}/${id}`).pipe(map((res) => res as CalendarEvent));
    }

    create(event: CalendarEvent): Observable<CalendarEvent> {
        return this.post(API_URLS.CALENDAR_EVENTS, event).pipe(map((res) => res as CalendarEvent));
    }

    update(event: CalendarEvent): Observable<CalendarEvent> {
        return this.put(`${API_URLS.CALENDAR_EVENTS}/${event.id}`, event).pipe(map((res) => res as CalendarEvent));
    }

    delete(id: number): Observable<void> {
        return this.del(`${API_URLS.CALENDAR_EVENTS}/${id}`);
    }
}