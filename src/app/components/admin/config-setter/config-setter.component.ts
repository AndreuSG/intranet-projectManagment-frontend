import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfigService } from '../../../api/config/config.service';
import { Config } from '../../../models/interfaces/config.interface';
import { Config as ConfigEnum } from '../../../models/enums/config.enum';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-config-setter',
  imports: [
    DialogModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    DatePickerModule,
    ButtonComponent
],
  templateUrl: './config-setter.component.html',
  styleUrl: './config-setter.component.scss'
})
export class ConfigSetterComponent {

  @Output() onConfirm = new EventEmitter<void>();

  configEnum = ConfigEnum;
  formGroup!: FormGroup;
  visible: boolean = true;

  configs: Config[] = [];

  configTranslations: { [key: string]: string } = {
    [ConfigEnum.DATA_INICI_FI_CURS]: 'Data d\'inici i fi del curs',
  }

  constructor(private configService: ConfigService) {
    this.configService.findAll().subscribe(configs => {
      this.configs = configs;
      this.createFormGroup();
    });
  }

  createFormGroup() {
    const formControls = this.configs.reduce((acc, config) => {
      let formControl!: FormControl;
      switch (config.code) {
        case ConfigEnum.DATA_INICI_FI_CURS:
          const value = JSON.parse(config.value) as string[];
          formControl = new FormControl<Date[] | null>(value.map(date => new Date(date)) as Date[] | null);
          if (!config.value) {
            formControl.setValidators([Validators.required]);
          }
          break;
      }
      acc[config.code] = formControl;
      return acc;
    }, {} as { [key: string]: FormControl });
    this.formGroup = new FormGroup(formControls);
  }

  saveConfigs() {
    const configsToSave = Object.keys(this.formGroup.value).map(key => ({
      code: key,
      value: this.formGroup.value[key]
    }));

    this.configService.update(configsToSave).subscribe(() => {
      this.onConfirm.emit();
    });
  }
}
