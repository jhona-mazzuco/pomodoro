import { DialogModule } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PomodoroComponent } from './components/pomodoro/pomodoro.component';
import { CircularProgressComponent } from './components/pomodoro/components/circular-progress/circular-progress.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingButtonComponent } from './components/setting-button/setting-button.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SoundInputComponent } from './components/settings/components/sound-input/sound-input.component';
import { MinutesInputComponent } from './components/settings/components/minutes-input/minutes-input.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
