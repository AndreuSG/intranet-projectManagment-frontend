// components/teacher/calendar/calendar-view.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import caLocale from '@fullcalendar/core/locales/ca';

@Component({
    selector: 'app-calendar-view',
    standalone: true,
    imports: [CommonModule, FullCalendarModule],
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent {
    calendarOptions = {
        locale: caLocale,
        timeZone: 'Europe/Madrid',
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        dateClick: this.handleDateClick.bind(this),
        events: [] // lo conectaremos a tu backend más adelante
    };

    handleDateClick(arg: any) {
        alert('Has clicado en: ' + arg.dateStr);
    }
}
