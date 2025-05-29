import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogModule } from 'primeng/dialog';
import { CalendarEventFormComponent } from './calendar-form/calendar-event-form.component';
import { CalendarService, CalendarEvent } from '../../../api/calendar/calendar.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import caLocale from '@fullcalendar/core/locales/ca';

@Component({
    selector: 'app-calendar-view',
    standalone: true,
    imports: [CommonModule, FullCalendarModule, DialogModule, CalendarEventFormComponent],
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit {
    showDialog = false;
    selectedDate: string = '';
    selectedEvent: CalendarEvent | null = null;

    calendarOptions: any = {
        locale: caLocale,
        timeZone: 'local', // Cambiado de 'Europe/Madrid' a 'local'
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        dateClick: this.handleDateClick.bind(this),
        eventClick: this.handleEventClick.bind(this),
        events: []
    };

    constructor(private calendarService: CalendarService) {}

    ngOnInit() {
        this.loadEvents();
    }

    loadEvents() {
        this.calendarService.findAll().subscribe((events: CalendarEvent[]) => {
            const calendarApi = this.calendarOptions;
            
            // Actualizar los eventos
            calendarApi.events = events.map(event => ({
                id: event.id?.toString(),
                title: event.title,
                start: event.start_time,
                end: event.end_time,
                backgroundColor: event.color,
                borderColor: event.color,
                extendedProps: {
                    description: event.description,
                    originalEvent: event
                }
            }));
            
            // Forzar la actualización del calendario
            this.calendarOptions = { ...this.calendarOptions };
        });
    }

    handleDateClick(arg: any) {
        this.selectedDate = arg.dateStr;
        this.selectedEvent = null; // Nuevo evento
        this.showDialog = true;
    }

    handleEventClick(arg: any) {
        this.selectedEvent = arg.event.extendedProps.originalEvent;
        this.selectedDate = arg.event.startStr.split('T')[0]; // Extraer fecha
        this.showDialog = true;
    }

    onCloseDialog(refresh: boolean) {
        this.showDialog = false;
        this.selectedEvent = null;
        if (refresh) {
            this.loadEvents();
        }
    }
}
