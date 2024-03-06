import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RythmSandboxComponent } from './rythm-sandbox.component';

describe('RythmSandboxComponent', () => {
  let component: RythmSandboxComponent;
  let fixture: ComponentFixture<RythmSandboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RythmSandboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RythmSandboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
