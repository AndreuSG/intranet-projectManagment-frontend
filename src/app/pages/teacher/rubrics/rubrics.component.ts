import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { RubricGroup } from '../../../models/interfaces/rubricGroup.interface';
import { RubricsService } from '../../../api/rubric/rubric.service';
import { RubricsGroupListComponent } from "../../../components/teacher/rubrics/rubrics-group/rubrics-group-list/rubric-group-list.component";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RubricsGroupFormComponent } from '../../../components/teacher/rubrics/rubrics-group/rubrics-form-group/rubrics-group-form.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-rubrics',
    templateUrl: './rubrics.component.html',
    styleUrls: ['./rubrics.component.scss'],
    imports: [BackButtonComponent, ButtonComponent, RubricsGroupListComponent, CommonModule],
    providers: [DialogService]
})
export class RubricsComponent implements OnInit {
    rubricGroups: RubricGroup[] = [];
    filteredCourses: RubricGroup[] = [];
    pageSize = 12;
    isLoading = false;
    ref?: DynamicDialogRef;

    constructor(
      private rubricsService: RubricsService,
      private dialogService: DialogService,
      private router: Router,
    ) {}

    onAddGroup(): void {
      this.ref = this.dialogService.open(RubricsGroupFormComponent, {
      header: 'Nou grup de rúbriques',
      width: '40rem',
      closable: true,
      styleClass: 'criteria-dialog'
      });
  
      this.ref.onClose.subscribe((newCourse) => {
        if (newCourse) {
          this.loadGroups();
        }
      });
    }

    ngOnInit(): void {
        this.loadGroups();
    }

    loadGroups(): void {
        this.isLoading = true;
        this.rubricsService.findAllGroups().subscribe({
        next: (res) => {
            this.rubricGroups = res;
        },
        error: (err) => console.error(err),
        complete: () => this.isLoading = false
        });
    }

    onPageChange(event: any): void {
    }

    onGroupSelected(groupId: string): void {
      this.router.navigate(['/teacher/rubriques', groupId]);
    }
}