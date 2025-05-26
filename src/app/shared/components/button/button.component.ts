import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'shared-button',
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input({ required: true })
  text!: string;

  @Input()
  icon?: string;

  @Input()
  type: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';

  @Input()
  disabled = false;

  @Output()
  click = new EventEmitter<MouseEvent>();

  public onClick(event: MouseEvent) {
    event.stopPropagation();
    this.click.emit(event);
  }
}
