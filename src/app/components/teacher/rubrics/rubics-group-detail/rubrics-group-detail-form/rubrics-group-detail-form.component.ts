import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';

/* PrimeNG */
import { FloatLabelModule }     from 'primeng/floatlabel';
import { InputTextModule }      from 'primeng/inputtext';
import { InputTextarea }  from 'primeng/inputtextarea';
import { MessageModule }        from 'primeng/message';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';


@Component({
    selector: 'app-rubric-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,

        /* PrimeNG */
        FloatLabelModule,
        InputTextModule,
        InputTextarea,
        MessageModule,

        /* Botón reutilizable */
        ButtonComponent
    ],
    templateUrl: './rubrics-group-detail-form.component.html',
    styleUrls: ['./rubrics-group-detail-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RubricFormComponent {

    form!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private ref: DynamicDialogRef,
        public  config: DynamicDialogConfig
        ) {
            this.form = this.fb.group({
                name:        ['', [Validators.required, Validators.maxLength(100)]],
                description: [''],
                maxScore:    [4,  [Validators.required, Validators.min(1), Validators.max(10)]]
            });
    }

  /* ---------- acciones ---------- */

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.ref.close(this.form.value);
    }


    cancel(): void {
        this.ref.close();
    }
}
