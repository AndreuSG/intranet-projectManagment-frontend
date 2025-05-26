import { Component } from '@angular/core';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { CalendarViewComponent } from '../../../components/teacher/calendar/calendar-view.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [
    BackButtonComponent,
    CalendarViewComponent
  ],
})
export class CalendarComponent {}
