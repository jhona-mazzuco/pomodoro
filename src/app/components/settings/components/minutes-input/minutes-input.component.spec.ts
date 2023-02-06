import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutesInputComponent } from './minutes-input.component';

describe('MinutesInoutComponent', () => {
  let component: MinutesInputComponent;
  let fixture: ComponentFixture<MinutesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinutesInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinutesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
