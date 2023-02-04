import { Injectable } from '@angular/core';
import { interval, Subscription, tap } from "rxjs";
import { SoundService } from "./sound.service";

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private _timer!: Subscription;
  private _currentTimer: number = 0;

  minutes: number = 5;

  displayTime: Date = new Date('2020-01-01 00:00');
  progress = 1;

  constructor(private sound: SoundService) {
  }

  private get minutesMS(): number {
    return this.minutes * 60_000;
  }

  start(): void {
    let minutes = this._currentTimer;
    if (!minutes) {
      minutes = this.minutesMS;
      this._currentTimer = minutes;
    }

    this._updateDisplay();
    this._timer = interval(1000)
      .pipe(
        tap(() => {
          this._currentTimer -= 1000;
          this._updateDisplay();
          if (this._currentTimer <= 0) {
            this.progress = 1;
            this.sound.playAttention();
            this.stop();
          } else {
            this.progress = this._currentTimer / this.minutesMS;
          }
        })
      ).subscribe();
  }

  stop() {
    this._timer.unsubscribe();
  }

  private _updateDisplay() {
    let seconds = Math.floor((this._currentTimer / 1000) % 60);
    let minutes = Math.floor((this._currentTimer / (1000 * 60)) % 60);
    this.displayTime = new Date(`2020-01-01 00:${ minutes }:${ seconds }`);
  }
}
