import { DecimalPipe } from "@angular/common";
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from "rxjs";
import { LOCAL_STORAGE_KEYS } from "../constants/local-storage-keys.constant";
import { LOCAL_STORAGE_TOKEN } from "../constants/local-storage-token";
import { PROGRESS_STATE } from "../constants/progress-state.constant";
import { Period } from '../types/period';
import { SoundService } from "./sound.service";

@Injectable({
  providedIn: 'root'
})
export class PomodoroService implements OnDestroy {
  private _timer!: Subscription;
  private _currentTime: number = 0;
  private _workDefault: number = 25;
  private _restDefault: number = 5;

  finished = false;
  displayTime: Date = new Date('2020-01-01 00:00');
  progress = PROGRESS_STATE.START;

  get time() {
    return this.finished ? this.restTime : this.workTime;
  }

  get workTime(): number {
    return this._getMinute('work');
  }

  set workTime(val: number) {
    this._setMinute(val, 'work');
  }

  get restTime(): number {
    return this._getMinute('rest');
  }

  set restTime(val: number) {
    this._setMinute(val, 'rest');
  }

  private get _milliseconds(): number {
    return this.time * 60_000;
  }

  private get _progress(): number {
    const time = this._currentTime / this._milliseconds;
    const progress = (this.finished ? time : 1 - time);
    return Number.parseFloat(this.numberPipe.transform(progress, '0.0-2')!);
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
    this.progress = PROGRESS_STATE.START;
    this._currentTime = this._milliseconds;
    this._timer?.unsubscribe();
    this._updateDisplay();
    this._timer = interval(1_000)
      .subscribe(this._updateState.bind(this));
  }

  stop(): void {
    this._currentTime = 0;
    this._updateDisplay();
    this._timer?.unsubscribe();
  }

  private _updateState(): void {
    this._currentTime -= 1_000;
    this._updateDisplay();
    this.progress = this._progress;
    if (this._currentTime === PROGRESS_STATE.START) {
      this._finish();
    }
  }

  private _updateDisplay(): void {
    let seconds = Math.floor((this._currentTime / 1_000) % 60);
    let minutes = Math.floor((this._currentTime / (1_000 * 60)) % 60);
    this.displayTime = new Date(`2020-01-01 00:${ minutes }:${ seconds }`);
  }

  private _finish(): void {
    this.sound.playWarning();
    this.finished = !this.finished;
    this._currentTime = this._milliseconds;
  }

  private _setMinute(val: number, period: Period): void {
    let stringData = this.localStorage.getItem(LOCAL_STORAGE_KEYS.MINUTES);
    const data = !!stringData ? JSON.parse(stringData) : {};
    this.localStorage.setItem(LOCAL_STORAGE_KEYS.MINUTES, JSON.stringify({ ...data, [period]: val }));
  }

  private _getMinute(period: Period): number {
    let stringData = this.localStorage.getItem(LOCAL_STORAGE_KEYS.MINUTES);
    const data = !!stringData ? JSON.parse(stringData) : {};
    return data[period] ?? this[`_${ period }Default`];
  }
}
