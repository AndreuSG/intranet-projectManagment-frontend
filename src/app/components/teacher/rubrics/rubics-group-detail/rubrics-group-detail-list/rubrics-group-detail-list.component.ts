import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Rubric } from '../../../../../models/interfaces/rubric.interface';

@Component({
    selector: 'rubrics-group-detail-list',
    templateUrl: './rubrics-group-detail-list.component.html',
    styleUrls: ['./rubrics-group-detail-list.component.scss'],
    standalone: true,
    imports: [CommonModule, CardModule, ProgressSpinnerModule],
})
export class RubricsGroupDetailListComponent {
    @Input() rubrics: Rubric[] = [];
    @Input() isLoading = false;
    @Input() maxScore?: number; // Añadido para mostrar puntuación máxima si se pasa
    @Output() rubricSelected = new EventEmitter<Rubric>();

    onSelect(rubric: Rubric) {
        this.rubricSelected.emit(rubric);
    }
}
