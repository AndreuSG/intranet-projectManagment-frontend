import { Component, EventEmitter, Input, Output, OnChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CalendarService, CalendarEvent } from '../../../../api/calendar/calendar.service';

@Component({
    selector: 'app-calendar-event-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputTextarea, CalendarModule, ColorPickerModule, ConfirmDialogModule],
    templateUrl: './calendar-event-form.component.html',
    styleUrls: ['./calendar-event-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmationService]
})
export class CalendarEventFormComponent implements OnChanges {
    @Input() date!: string;
    @Input() event: CalendarEvent | null = null;
    @Output() closed = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(
        private fb: FormBuilder, 
        private calendarService: CalendarService,
        private confirmationService: ConfirmationService
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            start_hour: [null, Validators.required],
            end_hour: [null],
            color: ['#2196f3']
        });
    }

    ngOnChanges() {
        if (this.event) {
            // Modo edición
            const startDate = new Date(this.event.start_time);
            const endDate = this.event.end_time ? new Date(this.event.end_time) : null;

            this.form.patchValue({
                title: this.event.title,
                description: this.event.description,
                start_hour: startDate,
                end_hour: endDate,
                color: this.event.color
            });
        } else {
            // Modo creación
            this.form.reset({
                title: '',
                description: '',
                start_hour: null,
                end_hour: null,
                color: '#2196f3'
            });
        }
    }

    onSubmit() {
        if (this.form.valid) {
            const dateStr = this.date;
            const startTime = this.form.value.start_hour;
            const endTime = this.form.value.end_hour;

            const toLocalDateTime = (time: Date) => {
                const year = dateStr.split('-')[0];
                const month = dateStr.split('-')[1];
                const day = dateStr.split('-')[2];
                const hours = time.getHours().toString().padStart(2, '0');
                const minutes = time.getMinutes().toString().padStart(2, '0');
                const seconds = '00';
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            };

            const payload = {
                title: this.form.value.title,
                description: this.form.value.description,
                color: this.form.value.color,
                start_time: toLocalDateTime(startTime),
                end_time: endTime ? toLocalDateTime(endTime) : undefined
            };

            if (this.event) {
                this.calendarService.update({ ...payload, id: this.event.id }).subscribe(() => {
                    this.closed.emit(true);
                });
            } else {
                this.calendarService.create(payload).subscribe(() => {
                    this.closed.emit(true);
                });
            }
        }
    }

    deleteEvent() {
        if (this.event && this.event.id) {
            this.confirmationService.confirm({
                message: 'Estàs segur que vols eliminar aquest esdeveniment?',
                header: 'Confirmar eliminació',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sí, eliminar',
                rejectLabel: 'Cancel·lar',
                accept: () => {
                    this.calendarService.delete(this.event!.id!).subscribe({
                        next: () => {
                            this.closed.emit(true);
                        },
                        error: (error) => {
                            console.error('Error eliminando evento:', error);
                        }
                    });
                }
            });
        }
    }

    cancel() {
        this.closed.emit(false);
    }
}
