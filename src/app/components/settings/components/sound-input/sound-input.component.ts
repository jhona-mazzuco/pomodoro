import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { AttentionAudio } from "../../../../shared/types/attention-audio.type";
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
  value!: AttentionAudio;

  soundIcon = faMusic;
  sounds = SOUNDS;

  onChange = (val: AttentionAudio) => {};
  onTouched = () => {};

  ngOnInit(): void {
    this.onTouched();
  }

  registerOnChange(fn: (val: AttentionAudio) => void): void {
    this.onChange= fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(sound: AttentionAudio) {
    this.value = sound;
    this.onChange(sound);
  }
}
