import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordsGridComponent } from './chords-grid.component';
import {Chords} from "../../../notes";

describe('ChordsGridComponent', () => {
  let component: ChordsGridComponent;
  let fixture: ComponentFixture<ChordsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordsGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChordsGridComponent);
    component = fixture.componentInstance;
    component.chords = Chords.fromAsciiChords('| Gm F | Eb D |')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
