import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(min: Date, max: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // no validar si está vacío

    const selectedDate = new Date(value);
    if (selectedDate < min || selectedDate > max) {
      return { outOfRange: true };
    }

    return null;
  };
}
