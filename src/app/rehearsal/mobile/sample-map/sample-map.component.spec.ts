import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleMapComponent } from './sample-map.component';

describe('SampleMapComponent', () => {
  let component: SampleMapComponent;
  let fixture: ComponentFixture<SampleMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SampleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
