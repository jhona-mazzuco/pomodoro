import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundInputComponent } from './sound-input.component';

describe('SoundInputComponent', () => {
  let component: SoundInputComponent;
  let fixture: ComponentFixture<SoundInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoundInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
