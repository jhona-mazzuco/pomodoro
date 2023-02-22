import { DecimalPipe } from "@angular/common";
import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { interval } from "rxjs";
import { LOCAL_STORAGE_KEYS } from "../constants/local-storage-keys.constant";
import { LOCAL_STORAGE_TOKEN } from "../constants/local-storage-token";
import { PROGRESS_STATE } from "../constants/progress-state.constant";

import { PomodoroService } from './pomodoro.service';
import { SoundService } from "./sound.service";

describe('PomodoroService', () => {
  let service: PomodoroService;
  let sound: SoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DecimalPipe,
        SoundService,
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
    service = TestBed.inject(PomodoroService);
    sound = TestBed.inject(SoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return saved minute', () => {
    const getItemSpy = spyOn(service['localStorage'], 'getItem').and.returnValue('10');

    expect(service.minutes).toEqual(10);
    expect(getItemSpy).toHaveBeenCalledWith(LOCAL_STORAGE_KEYS.MINUTES);
  })

  it('should save minute and save in local storage', () => {
    const setItemSpy = spyOn(service['localStorage'], 'setItem').and.stub();

    service.minutes = 5;

    expect(service.minutes).toEqual(5);
    expect(setItemSpy).toHaveBeenCalledWith(LOCAL_STORAGE_KEYS.MINUTES, '5');
  });

  it('should return 2 minutes in milliseconds', () => {
    service.minutes = 2;
    expect(service['_milliseconds']).toEqual(120_000);
  });

  it('should destroy interval subscription on service destroy', () => {
    service['_timer'] = interval(100).subscribe();

    const unsubscribeSpy = spyOn(service['_timer'], 'unsubscribe').and.stub();

    service.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  describe('start', () => {
    beforeEach(() => {
      service['_currentTime'] = 0;
      (service['_timer'] as any) = undefined;
    });

    it('should update current time when dont has a value', () => {
      service.minutes = 2;

      const millisecondsSpy = spyOnProperty((service as any), '_milliseconds', 'get').and.callThrough();

      service.start();

      expect(millisecondsSpy).toHaveBeenCalled();
      expect(service['_currentTime']).toEqual(120_000);
    });

    it('should destroy the last timer', () => {
      service['_timer'] = interval(100).subscribe();

      const unsubscribeSpy = spyOn(service['_timer'], 'unsubscribe');

      service.start();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should call updateDisplay', () => {
      const updateDisplaySpy = spyOn((service as any), '_updateDisplay').and.stub();

      service.start();

      expect(updateDisplaySpy).toHaveBeenCalled();
    });

    it('should fill timer with subscription of interval', () => {
      service.start();

      expect(service['_timer']).toBeDefined();
    });

    it('should update state after 1 second', fakeAsync(() => {
      const updateStateSpy = spyOn((service as any), '_updateState').and.callThrough();

      service.start();

      expect(updateStateSpy).not.toHaveBeenCalled();

      tick(1000)

      expect(updateStateSpy).toHaveBeenCalled();

      discardPeriodicTasks();
    }));
  });

  it('should destroy interval subscription', () => {
    service['_timer'] = interval(100).subscribe();

    const unsubscribeSpy = spyOn(service['_timer'], 'unsubscribe').and.stub();

    service.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should update display time with current time', () => {
    service['_currentTime'] = 630_000;

    service['_updateDisplay']();

    expect(service.displayTime.getMinutes()).toEqual(10);
    expect(service.displayTime.getSeconds()).toEqual(30);
  });

  describe('updateState', () => {
    it('should subtract 1 second of current time', () => {
      service['_currentTime'] = 60_000;

      service['_updateState']();

      expect(service['_currentTime']).toEqual(59_000);
    });

    it('should call update display method', () => {
      const updateDisplaySpy = spyOn((service as any), '_updateDisplay').and.stub();

      service['_updateState']();

      expect(updateDisplaySpy).toHaveBeenCalled();
    });

    it('should update progress', () => {
      service['_currentTime'] = 55_000;

      service.minutes = 1;

      service['_updateState']();

      expect(service.progress).toEqual(0.1);
    });

    it('should finish timer', () => {
      service['_currentTime'] = 1_000;

      const finishSpy = spyOn(service as any, '_finish').and.stub();

      service.minutes = 1;

      service['_updateState']();

      expect(service.progress).toEqual(PROGRESS_STATE.FINISH);
      expect(finishSpy).toHaveBeenCalled();
    });
  });

  it('should be finish timer', () => {
    const playWarningSpy = spyOn(sound, 'playWarning').and.stub();
    const emitSpy = spyOn(service.onFinished, 'emit').and.stub();
    const stopSpy = spyOn(service, 'stop').and.stub();

    service['_finish']();

    expect(playWarningSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
    expect(stopSpy).toHaveBeenCalled();
  });
});
