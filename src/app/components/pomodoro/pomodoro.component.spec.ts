import { DecimalPipe } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LOCAL_STORAGE_TOKEN } from "../../shared/constants/local-storage-token";
import { PomodoroService } from "../../shared/services/pomodoro.service";
import { PomodoroComponent } from './pomodoro.component';

describe('PomodoroComponent', () => {
  let component: PomodoroComponent;
  let fixture: ComponentFixture<PomodoroComponent>;
  let pomodoro: PomodoroService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PomodoroComponent],
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

    fixture = TestBed.createComponent(PomodoroComponent);
    component = fixture.componentInstance;
    pomodoro = TestBed.inject(PomodoroService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeStatus', () => {
    it('should start pomodoro', () => {
      component.started = false;

      const startSpy = spyOn(pomodoro, 'start').and.stub();

      component.changeStatus();

      expect(startSpy).toHaveBeenCalled();
      expect(component.started).toBeTrue();
    });

    it('should stop pomodoro', () => {
      component.started = true;

      const stopSpy = spyOn(pomodoro, 'stop').and.stub();

      component.changeStatus();

      expect(stopSpy).toHaveBeenCalled();
      expect(component.started).toBeFalse();
    });
  });

  it('should show play icon', () => {
    component.started = false;

    const iconEl = fixture.debugElement.query(By.css('fa-icon'));

    fixture.detectChanges();

    expect(iconEl.nativeNode.icon.iconName).toEqual('play');
  });

  it('should show stop icon', () => {
    component.started = true;

    const iconEl = fixture.debugElement.query(By.css('fa-icon'));

    fixture.detectChanges();

    expect(iconEl.nativeNode.icon.iconName).toEqual('stop');
  });

  it('should show 10 minutes and 25 seconds', () => {
    pomodoro.displayTime = new Date('2020-01-01 00:10:25');

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.pomodoro__timer'));

    expect(el.nativeElement.textContent).toEqual('10:25')
  });

  it('should show paused status label', () => {
    component.started = false;

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.pomodoro__status'));

    expect(el.nativeElement.textContent).toEqual('Parado')
  });

  it('should show paused started label', () => {
    component.started = true;

    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.pomodoro__status'));

    expect(el.nativeElement.textContent.toString().trim()).toEqual('Trabalhe')
  });

  it('should call changeStatus method when button clicked', () => {
    const el = fixture.debugElement.query(By.css('button'));

    const changeStatusSpy = spyOn(component, 'changeStatus').and.stub();

    el.nativeElement.click();

    expect(changeStatusSpy).toHaveBeenCalled();
  });
});

