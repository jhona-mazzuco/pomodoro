import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE_KEYS } from "../constants/local-storage-keys.constant";
import { LOCAL_STORAGE_TOKEN } from "../constants/local-storage-token";
import { WarningSound } from "../types/warning-sound";

import { SoundService } from './sound.service';

describe('SoundService', () => {
  let service: SoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
      ]
    });
    service = TestBed.inject(SoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default warning sound', () => {
    spyOn(service['localStorage'], 'getItem').and.returnValue(null);
    expect(service.warningSavedFile).toEqual('bell');
  });

  it('should saved warning sound', () => {
    const savedWarningSound: WarningSound = 'attention';

    spyOn(service['localStorage'], 'getItem').and.returnValue(savedWarningSound);

    expect(service.warningSavedFile).toEqual(savedWarningSound);
  });

  it('save new warning sound', () => {
    const savedWarningSound = 'bell';

    service['_warningSound'] = 'attention';

    const setItemSpy = spyOn(service['localStorage'], 'setItem').and.stub();

    service.warningSavedFile = savedWarningSound;

    expect(service['_warningSound']).toEqual(savedWarningSound);
    expect(setItemSpy).toHaveBeenCalledWith(LOCAL_STORAGE_KEYS.WARNING_SOUND_FILE, savedWarningSound);
  });

  it('should play notification sound', () => {
    const sound: WarningSound = 'attention';

    service['_warningSound'] = sound;

    const playSpy = spyOn(service, 'play').and.stub();

    service.playWarning();

    expect(playSpy).toHaveBeenCalledWith(sound);
  });

  it('should play audio', () => {
    const soundName: WarningSound = 'bell';
    const audio = new Audio();

    spyOn(window, 'Audio').and.returnValue(audio);

    const loadSpy = spyOn(audio, 'load').and.stub();
    const playSpy = spyOn(audio, 'play').and.stub();

    service.play(soundName);

    expect(!!audio.src.match(`/assets/sounds/${ soundName }.mp3`)).toBeTrue();
    expect(loadSpy).toHaveBeenCalled();
    expect(playSpy).toHaveBeenCalled();
  });
});
