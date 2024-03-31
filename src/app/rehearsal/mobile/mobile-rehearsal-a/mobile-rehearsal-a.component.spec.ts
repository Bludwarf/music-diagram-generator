import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRehearsalAComponent } from './mobile-rehearsal-a.component';

describe('MobileRehearsalAComponent', () => {
  let component: MobileRehearsalAComponent;
  let fixture: ComponentFixture<MobileRehearsalAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRehearsalAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileRehearsalAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
