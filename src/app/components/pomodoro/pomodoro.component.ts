import { Component } from '@angular/core';
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import { PomodoroService } from "../../shared/services/pomodoro.service";

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent {
  status = false;
  playIcon = faPlay;
  pauseIcon = faPause;

  constructor(protected service: PomodoroService) {
  }

  changeStatus() {
    this.status = !this.status;
    if (this.status) {
      this.service.start();
    } else {
      this.service.stop();
    }
  }
}
