import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingButtonComponent } from './setting-button.component';

describe('SettingButtonComponent', () => {
  let component: SettingButtonComponent;
  let fixture: ComponentFixture<SettingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
