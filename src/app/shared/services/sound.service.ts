import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEYS } from "../constants/local-storage-keys.constant";
import { AttentionAudio } from "../types/attention-audio.type";

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private _soundFile: AttentionAudio = 'bell';

  get attentionFile(): AttentionAudio {
    return window.localStorage.getItem(LOCAL_STORAGE_KEYS.SOUND_FILE) as AttentionAudio ?? this._soundFile;
  }

  set attentionFile(val: AttentionAudio) {
    this._soundFile = val;
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.SOUND_FILE, val);
  }

  playNotification(): void {
    this.play(this._soundFile);
  }

  play(sound: AttentionAudio) {
    const audio = new Audio();
    audio.src = `/assets/sounds/${ sound }.mp3`;
    audio.load();
    audio.play();
  }
}
