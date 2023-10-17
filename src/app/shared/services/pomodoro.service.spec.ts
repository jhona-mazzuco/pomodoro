import { DecimalPipe } from "@angular/common";
import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { LOCAL_STORAGE_KEYS } from '../constants/local-storage-keys.constant';
import { LOCAL_STORAGE_TOKEN } from "../constants/local-storage-token";
import { PROGRESS_STATE } from '../constants/progress-state.constant';

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

  afterEach(() => {
    service['_timer']?.unsubscribe();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('time', () => {
    it('should return rest time', () => {
      service.finished = true;

      const propSpy = spyOnProperty(service, 'restTime');

      service.time;

      expect(propSpy).toHaveBeenCalled();
    });

    it('should return work time', () => {
      service.finished = false;

      const propSpy = spyOnProperty(service, 'workTime');

      service.time;

      expect(propSpy).toHaveBeenCalled();
    });
  });

  it('should call getMinute', () => {
    const getMinuteSpy = spyOn(service as any, '_getMinute').and.stub();

    service.workTime;

    expect(getMinuteSpy).withContext('when call workTime').toHaveBeenCalledWith('work');

    service.restTime;

    expect(getMinuteSpy).withContext('when call restTime').toHaveBeenCalledWith('rest');
  });

  it('should call setMinute', () => {
    const setMinuteSpy = spyOn(service as any, '_setMinute').and.stub();

    const workTime = 100;
    service.workTime = workTime;

    expect(setMinuteSpy).withContext('when set workTime').toHaveBeenCalledWith(workTime, 'work');

    const restTime = 200;
    service.restTime = restTime;

    expect(setMinuteSpy).withContext('when set restTime').toHaveBeenCalledWith(restTime, 'rest');
  });

  it('should transform time in milliseconds', () => {

    spyOnProperty(service, 'time').and.returnValue(5);

    expect(service['_milliseconds']).toEqual(300_000);
  });

  it('should return progress', () => {
    service['_currentTime'] = 30640;

    service.finished = false;
    expect(service['_progress']).withContext('when is not finished').toEqual(0.98);

    service.finished = true;
    expect(service['_progress']).withContext('when is finished').toEqual(0.1);
  });

  it('should unsubscribe timer', () => {
    service['_timer'] = new Subscription();

    const unsubscribeSpy = spyOn(service['_timer'], 'unsubscribe').and.stub();

    service.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should start timer', () => {
    service.progress = PROGRESS_STATE.FINISH;

    const millisecondsSpy = spyOnProperty(service as any, '_milliseconds');
    const updateDisplaySpy = spyOn(service as any, '_updateDisplay').and.stub();

    service.start();

    expect(service.progress).toEqual(PROGRESS_STATE.START);
    expect(millisecondsSpy).toHaveBeenCalled();
    expect(updateDisplaySpy).toHaveBeenCalled();
  });

  it('should call updateState after one minute', fakeAsync(() => {
    const updateStateSpy = spyOn(service as any, '_updateState');

    service.start();

    tick(1_000);

    expect(updateStateSpy).toHaveBeenCalled();

    discardPeriodicTasks();
  }));

  it('should stop timer and set default state', () => {
    service['_currentTime'] = 500;
    service['_timer'] = new Subscription();

    const updateDisplaySpy = spyOn(service as any, '_updateDisplay');
    const unsubscribeSpy = spyOn(service['_timer'], 'unsubscribe');

    service.stop();

    expect(service['_currentTime']).toEqual(0);
    expect(updateDisplaySpy).toHaveBeenCalled();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should update state', () => {
    const progress = 0.7;
    service['_currentTime'] = 5_000;

    const updateDisplaySpy = spyOn(service as any, '_updateDisplay');
    spyOnProperty(service as any, '_progress').and.returnValue(progress);

    service['_updateState']();

    expect(service['_currentTime']).toEqual(4_000);
    expect(updateDisplaySpy).toHaveBeenCalled();
    expect(service.progress).toEqual(progress);
  });

  it('should call finish when start is current time', () => {
    service['_currentTime'] = 1_000;

    const finishSpy = spyOn(service as any, '_finish').and.stub();

    service['_updateState']();

    expect(finishSpy).toHaveBeenCalled();
  });

  it('should update display', () => {
    service.displayTime = new Date();
    service['_currentTime'] = 5345;

    service['_updateDisplay']();

    expect(service.displayTime.getSeconds()).toEqual(5);
    expect(service.displayTime.getMinutes()).toEqual(0);
  });

  it('should finish timer', () => {
    const milliseconds = 50_000;

    service.finished = false;

    const playSpy = spyOn(sound, 'playWarning').and.stub();
    spyOnProperty(service as any, '_milliseconds', 'get').and.returnValue(milliseconds);

    service['_finish']();

    expect(playSpy).toHaveBeenCalled();
    expect(service.finished).toBeTrue();
    expect(service['_currentTime']).toEqual(milliseconds);
  });

  it('should set minute', () => {
    const localStorage = service['localStorage'];

    const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    const setItemSpy = spyOn(localStorage, 'setItem').and.stub();

    service['_setMinute'](1, 'rest');

    const stringifyRestTest = JSON.stringify({ rest: 1 });
    expect(setItemSpy).withContext('when not have minutes saved').toHaveBeenCalledWith(LOCAL_STORAGE_KEYS.MINUTES, stringifyRestTest);


    getItemSpy.and.returnValue(JSON.stringify({ rest: 25, work: 5 }));

    service['_setMinute'](50, 'work');

    const stringifyWorkTest = JSON.stringify({ rest: 25, work: 50 })
    expect(setItemSpy).withContext('when have minutes saved').toHaveBeenCalledWith(LOCAL_STORAGE_KEYS.MINUTES, stringifyWorkTest);
  });

  it('should get minute', () => {
    const localStorage = service['localStorage'];

    const getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ rest: 5, work: 50 }))

    const restMinute = service['_getMinute']('rest');
    expect(restMinute).withContext('when have minute saved').toEqual(5);

    getItemSpy.and.returnValue(null);

    const workMinute = service['_getMinute']('work');
    expect(workMinute).withContext('when dont have minute saved').toEqual(service['_workDefault']);
  });
});
