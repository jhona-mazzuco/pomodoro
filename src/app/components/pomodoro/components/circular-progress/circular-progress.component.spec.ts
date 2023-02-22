import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser";

import { CircularProgressComponent } from './circular-progress.component';

describe('CircularProgressComponent', () => {
  let component: CircularProgressComponent;
  let fixture: ComponentFixture<CircularProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircularProgressComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CircularProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dont show progress bar', () => {
    component.showProgress = false;
    expect(fixture.debugElement.query(By.css('#progress'))).toBeNull();
  });

  it('should show progress bar with 10%', () => {
    component.showProgress = true;
    component.percentage = 0.1;
    fixture.detectChanges();
    const circleEl = fixture.debugElement.query(By.css('#progress'));
    expect(circleEl.styles['strokeDashoffset']).toEqual('825');
  });
});
