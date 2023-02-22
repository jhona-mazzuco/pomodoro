import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutesInputComponent } from './minutes-input.component';

describe('MinutesInputComponent', () => {
  let component: MinutesInputComponent;
  let fixture: ComponentFixture<MinutesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MinutesInputComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MinutesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change onChange', () => {
    const fn = (value: number) => {
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

  describe('increment', () => {
    let writeValueSpy: jasmine.Spy;
    beforeEach(() => {
      writeValueSpy = spyOn(component, 'writeValue').and.stub();
    });

    it('should dont change value', () => {
      component.value = 60;

      component.increment();

      expect(writeValueSpy).not.toHaveBeenCalled();
    });

    it('should change value', () => {
      component.value = 59;

      component.increment();

      expect(writeValueSpy).toHaveBeenCalledWith(60);
    });
  })

  describe('decrement', () => {
    let writeValueSpy: jasmine.Spy;
    beforeEach(() => {
      writeValueSpy = spyOn(component, 'writeValue').and.stub();
    });

    it('should dont change value', () => {
      component.value = 1;

      component.decrement();

      expect(writeValueSpy).not.toHaveBeenCalled();
    });

    it('should change value', () => {
      component.value = 2;

      component.decrement();

      expect(writeValueSpy).toHaveBeenCalledWith(1);
    });
  });

  it('should be writeValue', () => {
    const value = 10;

    const onChangeSpy = spyOn(component, 'onChange').and.stub();
    const onTouchedSpy = spyOn(component, 'onTouched').and.stub();

    component.value = 1;

    component.writeValue(value);

    expect(component.value).toEqual(value);
    expect(onChangeSpy).toHaveBeenCalledWith(value);
    expect(onTouchedSpy).toHaveBeenCalled();
  });
});
