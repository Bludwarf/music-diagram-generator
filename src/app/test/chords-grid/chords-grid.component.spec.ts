import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordsGridComponent } from './chords-grid.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
