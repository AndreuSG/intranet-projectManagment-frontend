import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-level-form-dialog',
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
  templateUrl: './level-form-dialog.component.html',
  styleUrls: ['./level-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LevelFormDialogComponent {
  form: FormGroup;
  maxScore = 10;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.maxScore = this.config.data?.maxScore ?? 10;
    this.form = this.fb.group({
      nom: ['', Validators.required],
      descripcio: [''],
      valor: [null, [Validators.required, Validators.min(0), Validators.max(this.maxScore)]]
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.value);
  }

  cancel() {
    this.ref.close();
  }
}
