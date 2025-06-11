import { Rubric } from './../../../../models/interfaces/rubric.interface';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { DialogService } from 'primeng/dynamicdialog';
import { RubricsGroupDetailListComponent } from '../../../../components/teacher/rubrics/rubics-group-detail/rubrics-group-detail-list/rubrics-group-detail-list.component';
import { RubricFormComponent } from '../../../../components/teacher/rubrics/rubics-group-detail/rubrics-group-detail-form/rubrics-group-detail-form.component';
import { RubricsService } from '../../../../api/rubric/rubric.service';
import { CriteriaListDialogComponent } from '../../../../components/teacher/rubrics/criteria-list-dialog/criteria-list-dialog.component';

@Component({
    selector: 'app-rubrics-detail',
    templateUrl: './rubrics-detail.component.html',
    styleUrls: ['./rubrics-detail.component.scss'],
    imports: [CommonModule, BackButtonComponent, ButtonComponent, RubricsGroupDetailListComponent],
    providers: [DialogService]
})
export class RubricsDetailComponent implements OnInit {
    groupId!: string;
    group: any;
    rubrics: any[] = [];
    ref: any;
    isLoading = false;

    constructor(
        private route: ActivatedRoute,
        private dialogService: DialogService,
        private rubricsService: RubricsService
    ) {}

    ngOnInit() {
        this.groupId = this.route.snapshot.paramMap.get('id')!;
        this.loadRubrics();
    }

    onAddRubric(): void {
        if (this.ref) return;

        this.ref = this.dialogService.open(RubricFormComponent, {
            header: 'Nova rúbrica',
            width:  '28rem',
            modal:  true,
            styleClass: 'rubric-dialog',
            data: { rubriquesGrupId: +this.groupId },
            closable: true
        });

        this.ref.onClose.subscribe((result: Rubric) => {
            if (result) {
                this.isLoading = true;
                const dto = { ...result, rubriquesGrupId: +this.groupId };

                this.rubricsService.createRubric(dto).subscribe({
                    next: () => this.loadRubrics(),
                    error: err => {
                        console.error(err);
                        this.isLoading = false;
                    }
                });
            }
            this.ref = undefined;
        });
    }

    onRubricSelected(rubric: Rubric): void {
        const ref = this.dialogService.open(CriteriaListDialogComponent, {
            header: `Criteris – ${rubric.nom}`,
            width:  '40rem',
            data:   { rubricId: rubric.id, maxScore: rubric.puntuacioMax },
            closable: true,
            modal: true
        });
    }

    private loadRubrics(): void {
        this.isLoading = true;
        this.rubricsService.findRubricsByGroup(+this.groupId).subscribe({
            next:  data => (this.rubrics = data),
            error: err  => console.error(err),
            complete:   () => (this.isLoading = false)
        });
    }
}