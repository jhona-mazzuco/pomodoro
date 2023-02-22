import { DialogModule } from "@angular/cdk/dialog";
import { CommonModule, DecimalPipe } from "@angular/common";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { CircularProgressComponent } from './components/pomodoro/components/circular-progress/circular-progress.component';
import { PomodoroComponent } from './components/pomodoro/pomodoro.component';
import { SettingButtonComponent } from './components/setting-button/setting-button.component';
import { MinutesInputComponent } from './components/settings/components/minutes-input/minutes-input.component';
import { SoundInputComponent } from './components/settings/components/sound-input/sound-input.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LOCAL_STORAGE_TOKEN } from "./shared/constants/local-storage-token";
import { PomodoroService } from "./shared/services/pomodoro.service";
import { SoundService } from "./shared/services/sound.service";

@NgModule({
  declarations: [
    AppComponent,
    PomodoroComponent,
    CircularProgressComponent,
    SettingButtonComponent,
    SettingsComponent,
    SoundInputComponent,
    MinutesInputComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    DialogModule
  ],
  providers: [
    DecimalPipe,
    PomodoroService,
    SoundService,
    {
      provide: LOCAL_STORAGE_TOKEN,
      useValue: window.localStorage
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
