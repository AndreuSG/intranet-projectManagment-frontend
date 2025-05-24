import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-criteria-form-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FloatLabelModule,
        InputTextModule,
        InputTextarea,
        InputNumberModule,
        ButtonModule
    ],
    templateUrl: './criteria-form-dialog.component.html'
})
export class CriteriaFormDialogComponent {
    form: FormGroup;

    constructor(public ref: DynamicDialogRef, private fb: FormBuilder) {
        this.form = this.fb.group({
            nom: ['', Validators.required],
            descripcio: [''],
            pes: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
        });
    }

    save() {
        if (this.form.invalid) return;
        this.ref.close(this.form.value);
    }

    cancel() {
        this.ref.close();
    }
}
