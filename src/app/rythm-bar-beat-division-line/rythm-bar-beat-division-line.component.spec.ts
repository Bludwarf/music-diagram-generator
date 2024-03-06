import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RythmBarBeatDivisionLineComponent } from './rythm-bar-beat-division-line.component';

describe('RythmBarBeatDivisionLineComponent', () => {
  let component: RythmBarBeatDivisionLineComponent;
  let fixture: ComponentFixture<RythmBarBeatDivisionLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RythmBarBeatDivisionLineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RythmBarBeatDivisionLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
