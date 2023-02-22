import { DecimalPipe } from "@angular/common";
import { EventEmitter, Inject, Injectable, OnDestroy, Output } from '@angular/core';
import { interval, Subscription } from "rxjs";
import { LOCAL_STORAGE_KEYS } from "../constants/local-storage-keys.constant";
import { LOCAL_STORAGE_TOKEN } from "../constants/local-storage-token";
import { PROGRESS_STATE } from "../constants/progress-state.constant";
import { SoundService } from "./sound.service";

@Injectable({
  providedIn: 'root'
})
export class PomodoroService implements OnDestroy {
  @Output() onFinished = new EventEmitter<void>();

  private _timer!: Subscription;
  private _currentTime: number = 0;
  private _minutes: number = 5;

  displayTime: Date = new Date('2020-01-01 00:00');
  progress = PROGRESS_STATE.START;

  get minutes(): number {
    const val = this.localStorage.getItem(LOCAL_STORAGE_KEYS.MINUTES);
    return val ? Number.parseInt(val) : this._minutes;
  }

  set minutes(val: number) {
    this.localStorage.setItem('@NG_POMODORO_MINUTES', val.toString());
    this._minutes = val;
  }

  private get _milliseconds(): number {
    return this.minutes * 60_000;
  }

  constructor(
    @Inject(LOCAL_STORAGE_TOKEN) private localStorage: Storage,
    private sound: SoundService,
    private numberPipe: DecimalPipe
  ) {
  }

  ngOnDestroy(): void {
    this._timer?.unsubscribe();
  }

  start(): void {
    let minutes = this._currentTime;
    if (!minutes) {
      minutes = this._milliseconds;
      this._currentTime = minutes;
    }

    this._timer?.unsubscribe();
    this._updateDisplay();
    this._timer = interval(1_000)
      .subscribe(this._updateState.bind(this));
  }

  stop(): void {
    this._timer?.unsubscribe();
  }

  private _updateDisplay(): void {
    let seconds = Math.floor((this._currentTime / 1_000) % 60);
    let minutes = Math.floor((this._currentTime / (1_000 * 60)) % 60);
    this.displayTime = new Date(`2020-01-01 00:${ minutes }:${ seconds }`);
  }

  private _updateState(): void {
    this._currentTime -= 1_000;
    this._updateDisplay();
    this.progress = Number.parseFloat(this.numberPipe.transform(1 - this._currentTime / this._milliseconds, '0.0-2')!);
    if (this._currentTime === PROGRESS_STATE.START) {
      this._finish();
    }
  }

  private _finish(): void {
    this.sound.playWarning();
    this.onFinished.emit();
    this.stop();
  }
}
