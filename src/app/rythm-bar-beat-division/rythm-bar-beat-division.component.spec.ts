import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RythmBarBeatDivisionComponent } from './rythm-bar-beat-division.component';

describe('RythmBarBeatDivisionComponent', () => {
  let component: RythmBarBeatDivisionComponent;
  let fixture: ComponentFixture<RythmBarBeatDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RythmBarBeatDivisionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RythmBarBeatDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
