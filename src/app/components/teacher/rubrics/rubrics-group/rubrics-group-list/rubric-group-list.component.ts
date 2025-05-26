import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RubricGroup } from '../../../../../models/interfaces/rubricGroup.interface';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Card } from 'primeng/card';


@Component({
    selector: 'rubric-group-list',
    templateUrl: './rubric-goup-list.component.html',
    styleUrls: ['./rubric-group-list.component.scss'],
    imports: [
        CommonModule,
        Card,
        ProgressSpinnerModule,
    ]
})
export class RubricsGroupListComponent {
    @Input() groups: RubricGroup[] = [];
    @Input() isLoading = false;
    @Output() groupSelected = new EventEmitter<string>();

    onSelect(id: string) {
        this.groupSelected.emit(id);
    }
}
