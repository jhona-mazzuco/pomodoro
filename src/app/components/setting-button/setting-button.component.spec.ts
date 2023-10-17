import { Overlay, OverlayModule, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser";
import { Observable, Subject } from "rxjs";
import { SettingsComponent } from "../settings/settings.component";

import { SettingButtonComponent } from './setting-button.component';

describe('SettingButtonComponent', () => {
  let component: SettingButtonComponent;
  let fixture: ComponentFixture<SettingButtonComponent>;
  let overlay: Overlay;
  let createSpy: jasmine.Spy;
  let attachSpy: jasmine.Spy;

  const backdropClickEvent = new Subject<void>();
  const closeEvent = new Subject<void>();
  const ref = {
    backdropClick(): Observable<MouseEvent> {
      return backdropClickEvent as unknown as Observable<MouseEvent>;
    },
    attach<T>(portal: ComponentPortal<T>): ComponentRef<T> {
      return {} as ComponentRef<any>;
    },
    detach(): any {
    }
  } as OverlayRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingButtonComponent],
      imports: [OverlayModule],
      providers: [Overlay],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingButtonComponent);
    component = fixture.componentInstance;
    overlay = TestBed.inject(Overlay);
    createSpy = spyOn(overlay, 'create').and.returnValue(ref);
    attachSpy = spyOn(ref, 'attach').and.returnValue({
      get instance() {
        return {
          close: closeEvent
        }
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    component.open();

    expect(createSpy).toHaveBeenCalledWith({
      hasBackdrop: true,
      disposeOnNavigation: true,
      positionStrategy: overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
    expect(attachSpy).toHaveBeenCalledWith(new ComponentPortal(SettingsComponent));
  });

  it('should close modal when have backdrop click', () => {
    const detachSpy = spyOn(ref, 'detach').and.stub();

    component.open();

    backdropClickEvent.next();

    expect(detachSpy).toHaveBeenCalled();
  });

  it('should close modal in backdrop click', () => {
    const detachSpy = spyOn(ref, 'detach').and.stub();

    component.open();

    backdropClickEvent.next();

    expect(detachSpy).toHaveBeenCalled();
  });

  it('should close modal in backdrop click', () => {
    const detachSpy = spyOn(ref, 'detach').and.stub();

    component.open();

    closeEvent.next();

    expect(detachSpy).toHaveBeenCalled();
  });

  it('should call open method on click in button', () => {
    const el = fixture.debugElement.query(By.css('button'));

    const openSpy = spyOn(component, 'open').and.stub();

    el.nativeElement.click();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should has cog icon', () => {
    const el = fixture.debugElement.query(By.css('fa-icon'));

    expect(el.nativeNode.icon.iconName).toEqual('gear');
  });
});
