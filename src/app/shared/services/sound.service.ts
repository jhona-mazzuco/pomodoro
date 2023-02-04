import { Injectable } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { AttentionAudio } from "../types/attention-audio.type";

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  attentionFile: AttentionAudio = 'bell';

  constructor(private sanitizer: DomSanitizer) { }

  playAttention(): void {
    this.sanitizer.bypassSecurityTrustResourceUrl(`../../../assets/${this.attentionFile}.mp3`);
  }
}
