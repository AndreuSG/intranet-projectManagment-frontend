import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RubricCriterion } from '../../../../models/interfaces/rubricCriterion.interface';
import { RubricsService } from '../../../../api/rubric/rubric.service';
import { CriteriaFormDialogComponent } from '../criteria/criteria-form-dialog.component';
import { LevelsDialogComponent } from '../levels/levels-dialog/levels-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-criteria-list-dialog',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        ProgressSpinnerModule,
        ConfirmDialogModule
    ],
    templateUrl: './criteria-list-dialog.component.html',
    styleUrls: ['./criteria-list-dialog.component.scss'],
    providers: [DialogService, ConfirmationService, MessageService]
})
export class CriteriaListDialogComponent {
    rubricId!: number;
    maxScore!: number;
    criteria: RubricCriterion[] = [];
    loading = true;

    constructor(
        private rubricsSvc: RubricsService,
        private dialogSvc: DialogService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.rubricId = this.config.data.rubricId;
        this.maxScore = this.config.data.maxScore;
        this.loadCriteria();
        console.log('RubricId:', this.rubricId);
    }

    loadCriteria() {
        this.loading = true;
        this.rubricsSvc.getCriteria(this.rubricId).subscribe({
            next: res => {
                this.criteria = [...res];
                console.log('Criteria loaded:', this.criteria);
            },
            error: err => console.error(err),
            complete: () => this.loading = false
        });
    }

    openNewCriterion() {
        const ref = this.dialogSvc.open(CriteriaFormDialogComponent, {
            header: 'Nou criteri',
            width:  '26rem',
            modal:  true,
            closable: true,
            styleClass: 'criteria-dialog', 
        });

        ref.onClose.subscribe((dto?: { nom: string; descripcio?: string; pes: number }) => {
            if (!dto) return;
            this.rubricsSvc.createCriterion({
                ...dto,
                rubricaId: this.rubricId
            }).subscribe(() => this.loadCriteria());
        });
    }

    delete(id: number) {
        console.log('Intentando eliminar criterio con id:', id);
        this.confirmationService.confirm({
            message: 'Segur que vols eliminar aquest criteri?',
            accept: () => {
                console.log('Confirmado, llamando a deleteCriterion');
                this.rubricsSvc.deleteCriterion(id).subscribe({
                    next: () => {
                        console.log('Criterio eliminado, recargando...');
                        this.loadCriteria();
                    },
                    error: () => this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No s\'ha pogut eliminar el criteri'
                    })
                });
            }
        });
    }

    openLevelsDialog(criteri: { id: number; nom: string }) {
        const ref = this.dialogSvc.open(LevelsDialogComponent, {
            header: `Nivells de “${criteri.nom}”`,
            width: '600px',
            styleClass: 'criteria-dialog',
            closable: true,       
            data: { criteriId: criteri.id, maxScore: this.maxScore }
        });

        ref.onClose.subscribe(() => {
            this.loadCriteria();
        });
    }
}
