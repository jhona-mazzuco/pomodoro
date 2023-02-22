import { Component, OnInit } from '@angular/core';
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import { PomodoroService } from "../../shared/services/pomodoro.service";

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent implements OnInit {
  started = false;
  playIcon = faPlay;
  pauseIcon = faPause;

  constructor(protected pomodoro: PomodoroService) {
  }

  ngOnInit(): void {
    this.pomodoro.onFinished.subscribe(() => this.started = false);
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
