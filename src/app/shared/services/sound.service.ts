import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEYS } from "../constants/local-storage-keys.constant";
import { LOCAL_STORAGE_TOKEN } from "../constants/local-storage-token";
import { WarningSound } from "../types/warning-sound";

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private _warningSound: WarningSound = 'bell';

  get warningSavedFile(): WarningSound {
    return this.localStorage.getItem(LOCAL_STORAGE_KEYS.WARNING_SOUND_FILE) as WarningSound ?? this._warningSound;
  }

  set warningSavedFile(val: WarningSound) {
    this._warningSound = val;
    this.localStorage.setItem(LOCAL_STORAGE_KEYS.WARNING_SOUND_FILE, val);
  }

  constructor(@Inject(LOCAL_STORAGE_TOKEN) private localStorage: Storage,) {
  }

  playWarning(): void {
    this.play(this._warningSound);
  }

  play(soundName: WarningSound): void {
    const audio = new Audio();
    audio.src = `/assets/sounds/${ soundName }.mp3`;
    audio.load();
    audio.play();
  }
}
