import { DecimalPipe } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { LOCAL_STORAGE_TOKEN } from "../../shared/constants/local-storage-token";
import { PROGRESS_STATE } from "../../shared/constants/progress-state.constant";
import { PomodoroService } from "../../shared/services/pomodoro.service";
import { SoundService } from "../../shared/services/sound.service";
import { WarningSound } from "../../shared/types/warning-sound.type";
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

  it('should call build form method', () => {
    const buildFormSpy = spyOn(component, 'buildForm').and.stub();

    component.ngOnInit();

    expect(buildFormSpy).toHaveBeenCalled();
  });

  it('should build form', () => {
    const minutes = 1;
    const attentionFile: WarningSound = 'attention';

    const groupSpy = spyOn(fb, 'group').and.stub().and.returnValue(new FormGroup({}));
    const minutesSpy = spyOnProperty(pomodoro, 'minutes', 'get').and.returnValue(minutes);
    const attentionFileSpy = spyOnProperty(sound, 'warningSavedFile', 'get').and.returnValue(attentionFile);

    component.buildForm();

    expect(minutesSpy).toHaveBeenCalled();
    expect(attentionFileSpy).toHaveBeenCalled();
    expect(groupSpy).toHaveBeenCalledWith({
      minutes: [minutes],
      sound: [attentionFile]
    } as unknown as FormGroup<SettingForm>);
  });

  it('should be onSubmit', () => {
    const minutes = 1;
    const attentionFile: WarningSound = 'attention';

    pomodoro.progress = 0.43;
    component.form = new FormGroup<SettingForm>({
      minutes: new FormControl(minutes),
      sound: new FormControl<WarningSound>(attentionFile)
    });

    const minutesSpy = spyOnProperty(pomodoro, 'minutes', 'set').and.callThrough();
    const attentionFileSpy = spyOnProperty(sound, 'warningSavedFile', 'set').and.callThrough();
    const emitSpy = spyOn(component.close, 'emit').and.stub();

    component.onSubmit();

    expect(minutesSpy).toHaveBeenCalledWith(minutes);
    expect(attentionFileSpy).toHaveBeenCalledWith(attentionFile);
    expect(pomodoro.progress).toEqual(PROGRESS_STATE.FINISH);
    expect(emitSpy).toHaveBeenCalled();
  });
});
