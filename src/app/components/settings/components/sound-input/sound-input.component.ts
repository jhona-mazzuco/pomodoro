import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { SoundService } from "../../../../shared/services/sound.service";
import { WarningSound } from "../../../../shared/types/warning-sound";
import { SOUNDS } from "../../constants/sounds.constant";

@Component({
  selector: 'app-sound-input',
  templateUrl: './sound-input.component.html',
  styleUrls: ['./sound-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SoundInputComponent),
      multi: true
    }
  ]
})
export class SoundInputComponent implements ControlValueAccessor, OnInit {
  value!: WarningSound;

  soundIcon = faMusic;
  sounds = SOUNDS;

  onChange = (val: WarningSound) => {};
  onTouched = () => {};

  constructor(private sound: SoundService) {
  }

  ngOnInit(): void {
    this.onTouched();
  }

  registerOnChange(fn: (val: WarningSound) => void): void {
    this.onChange= fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onClick(sound: WarningSound): void {
    this.sound.play(sound);
    this.writeValue(sound);
  }

  writeValue(sound: WarningSound) {
    this.value = sound;
    this.onChange(sound);
  }
}
