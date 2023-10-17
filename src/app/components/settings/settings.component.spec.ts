import { DecimalPipe } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { LOCAL_STORAGE_TOKEN } from "../../shared/constants/local-storage-token";
import { PROGRESS_STATE } from "../../shared/constants/progress-state.constant";
import { PomodoroService } from "../../shared/services/pomodoro.service";
import { SoundService } from "../../shared/services/sound.service";
import { WarningSound } from "../../shared/types/warning-sound";
import { MinutesInputComponent } from "./components/minutes-input/minutes-input.component";
import { SoundInputComponent } from "./components/sound-input/sound-input.component";
import { SettingForm } from "./interfaces/setting-form.interface";

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let fb: FormBuilder;
  let pomodoro: PomodoroService;
  let sound: SoundService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SettingsComponent,
        MinutesInputComponent,
        SoundInputComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [
        DecimalPipe,
        PomodoroService,
        {
          provide: LOCAL_STORAGE_TOKEN,
          useValue: {
            getItem: (key: string) => {
            },
            setItem: (key: string) => {
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    pomodoro = TestBed.inject(PomodoroService);
    sound = TestBed.inject(SoundService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build form', () => {
    const workTime = 10;
    const restTime = 5;
    const attentionFile: WarningSound = 'attention';

    const groupSpy = spyOn(fb, 'group').and.stub().and.returnValue(new FormGroup({}));
    spyOnProperty(pomodoro, 'workTime', 'get').and.returnValue(workTime);
    spyOnProperty(pomodoro, 'restTime', 'get').and.returnValue(restTime);
    spyOnProperty(sound, 'warningSavedFile', 'get').and.returnValue(attentionFile);

    component.ngOnInit();

    expect(groupSpy).toHaveBeenCalledWith({
      workTime: [workTime],
      restTime: [restTime],
      sound: [attentionFile]
    } as unknown as FormGroup<SettingForm>);
  });

  it('should be onSubmit', () => {
    const workTime = 20;
    const restTime = 10;
    const attentionFile: WarningSound = 'attention';

    pomodoro.progress = 0.43;
    component.form = new FormGroup<SettingForm>({
      workTime: new FormControl<number>(workTime),
      restTime: new FormControl<number>(restTime),
      sound: new FormControl<WarningSound>(attentionFile)
    });

    const workSpy = spyOnProperty(pomodoro, 'workTime', 'set').and.callThrough();
    const restSpy = spyOnProperty(pomodoro, 'restTime', 'set').and.callThrough();
    const attentionFileSpy = spyOnProperty(sound, 'warningSavedFile', 'set').and.callThrough();
    const emitSpy = spyOn(component.close, 'emit').and.stub();

    component.onSubmit();

    expect(workSpy).toHaveBeenCalledWith(workTime);
    expect(restSpy).toHaveBeenCalledWith(restTime);
    expect(attentionFileSpy).toHaveBeenCalledWith(attentionFile);
    expect(pomodoro.progress).toEqual(PROGRESS_STATE.START);
    expect(emitSpy).toHaveBeenCalled();
  });
});
