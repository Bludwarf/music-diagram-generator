import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RythmBarBeatComponent } from './rythm-bar-beat.component';

describe('RythmBarBeatComponent', () => {
  let component: RythmBarBeatComponent;
  let fixture: ComponentFixture<RythmBarBeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RythmBarBeatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RythmBarBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
