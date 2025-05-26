import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LevelFormDialogComponent } from '../level-form-dialog/level-form-dialog.component';
import { RubricLevel } from '../../../../../models/interfaces/rubricLevel.interface';
import { RubricsService } from '../../../../../api/rubric/rubric.service';

@Component({
    selector: 'app-levels-dialog',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, ConfirmDialogModule],
    templateUrl: './levels-dialog.component.html',
    styleUrls: ['./levels-dialog.component.scss'],
    providers: [DialogService, ConfirmationService, MessageService],
    encapsulation: ViewEncapsulation.None
})
export class LevelsDialogComponent implements OnInit {
    criteriId!: number;
    levels: RubricLevel[] = [];
    loading = false;
    ref?: DynamicDialogRef;
    maxScore!: number;

    constructor(
        private rubricsService: RubricsService,
        private dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public config: DynamicDialogConfig
    ) { }

    ngOnInit() {
        this.criteriId = this.config.data.criteriId;
        this.maxScore = this.config.data.maxScore;
        this.loadLevels();
    }

    loadLevels() {
        this.loading = true;
        this.rubricsService.getLevels(this.criteriId).subscribe({
            next: levels => { this.levels = levels; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    openAddLevel() {
        this.ref = this.dialogService.open(LevelFormDialogComponent, {
            header: 'Afegir nivell',
            width: '400px',
            styleClass: 'p-fluid',
            closable: true,
            data: { maxScore: this.maxScore }
        });
        this.ref.onClose.subscribe(result => {
            if (result) {
                const dto = { ...result, criteriId: this.criteriId };
                this.rubricsService.createLevel(dto).subscribe({
                    next: () => { this.loadLevels(); },
                    error: () => { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No s\'ha pogut crear el nivell' }); }
                });
            }
        });
    }

    deleteLevel(level: RubricLevel) {
        this.confirmationService.confirm({
            message: `Segur que vols eliminar el nivell "${level.nom}"?`,
            accept: () => {
                this.rubricsService.deleteLevel(level.id!).subscribe({
                    next: () => { this.loadLevels(); },
                    error: () => { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No s\'ha pogut eliminar el nivell' }); }
                });
            }
        });
    }
}
