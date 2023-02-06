import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-minutes-input',
  templateUrl: './minutes-input.component.html',
  styleUrls: ['./minutes-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MinutesInputComponent),
      multi: true
    }
  ]
})
export class MinutesInputComponent implements ControlValueAccessor {
  value!: number;

  onChange = (val: number) => {};
  onTouched = () => {};

  registerOnChange(fn: (val: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  increment(): void {
    const val = this.value + 1;
    if (val <= 60) {
      this.writeValue(val);
    }
  }

  decrement(): void {
    const val = this.value - 1;
    if (val >= 1) {
      this.writeValue(val);
    }
  }

  writeValue(val: number): void {
    this.value = val;
    this.onChange(val);
    this.onTouched();
  }
}
