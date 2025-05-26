import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { RubricsService } from '../../../../../api/rubric/rubric.service';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'rubrics-group-form',
    templateUrl: './rubrics-group-form.component.html',
    styleUrls: ['./rubrics-group-form.component.scss'],
    imports: [ReactiveFormsModule, FloatLabelModule, MessageModule, NgIf, ButtonModule],
})
export class RubricsGroupFormComponent implements OnInit {
    formGroup!: FormGroup;
    isSaving = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: DynamicDialogRef,
        private rubricsService: RubricsService
    ) {}

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.formGroup = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        });
    }

    onSave(): void {
        if (this.formGroup.valid) {
            this.isSaving = true;
            const { name, description } = this.formGroup.value;
            
            this.rubricsService.createGroup({ name, description }).subscribe({
                next: (newCourse) => {
                // Devuelve el nuevo curso a quien llamó el diálogo
                this.dialogRef.close(newCourse);
                },
                error: (err) => {
                console.error(err);
                this.isSaving = false;
                }
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close(null);
    }
}
