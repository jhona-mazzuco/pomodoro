import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE_TOKEN } from "../../../../shared/constants/local-storage-token";
import { SoundService } from "../../../../shared/services/sound.service";
import { WarningSound } from "../../../../shared/types/warning-sound";

import { SoundInputComponent } from './sound-input.component';

describe('SoundInputComponent', () => {
  let component: SoundInputComponent;
  let fixture: ComponentFixture<SoundInputComponent>;
  let sound: SoundService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoundInputComponent],
      providers: [
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

    fixture = TestBed.createComponent(SoundInputComponent);
    component = fixture.componentInstance;
    sound= TestBed.inject(SoundService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onTouched', () => {
    const onTouchedSpy = spyOn(component, 'onTouched').and.stub();

    component.ngOnInit();

    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should change onChange', () => {
    const fn = (value: WarningSound) => {
    };

    component.registerOnChange(fn);

    expect(component.onChange).toEqual(fn);
  });

  it('should change onTouched', () => {
    const fn = () => {
    };

    component.registerOnTouched(fn);

    expect(component.onTouched).toEqual(fn);
  });

  it('should be onClick', () => {
    const audio = 'attention';

    const playSpy = spyOn(sound, 'play').and.stub();
    const writeValueSpy = spyOn(component, 'writeValue').and.stub();

    component.onClick(audio);

    expect(playSpy).toHaveBeenCalledWith(audio);
    expect(writeValueSpy).toHaveBeenCalledWith(audio);
  });

  it('should be writeValue', () => {
    const audio = 'attention';

    component.value = 'attention-whistle';

    const onChangeSpy = spyOn(component, 'onChange').and.stub();

    component.writeValue(audio);

    expect(onChangeSpy).toHaveBeenCalledWith(audio);
  });
});
