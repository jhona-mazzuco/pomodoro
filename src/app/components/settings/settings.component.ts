import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { PROGRESS_STATE } from "../../shared/constants/progress-state.constant";
import { PomodoroService } from "../../shared/services/pomodoro.service";
import { SoundService } from "../../shared/services/sound.service";
import { SettingForm } from "./interfaces/setting-form.interface";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  form!: FormGroup<SettingForm>

  constructor(
    private fb: FormBuilder,
    private pomodoro: PomodoroService,
    private sound: SoundService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      workTime: [this.pomodoro.workTime],
      restTime: [this.pomodoro.restTime],
      sound: [this.sound.warningSavedFile]
    }) as FormGroup<SettingForm>;
  }

  onSubmit(): void {
    const { sound, workTime, restTime } = this.form.value;
    this.pomodoro.workTime = workTime!;
    this.pomodoro.restTime = restTime!;
    this.sound.warningSavedFile = sound!;
    this.pomodoro.progress = PROGRESS_STATE.START;
    this.close.emit();
  }
}
