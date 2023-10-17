import { Component } from '@angular/core';
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import { PomodoroService } from "../../shared/services/pomodoro.service";

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent {
  readonly playIcon = faPlay;
  readonly stopIcon = faStop;

  started = false;

  constructor(protected pomodoro: PomodoroService) {
  }

  changeStatus() {
    this.started = !this.started;
    if (this.started) {
      this.pomodoro.start();
    } else {
      this.pomodoro.stop();
    }
  }
}
