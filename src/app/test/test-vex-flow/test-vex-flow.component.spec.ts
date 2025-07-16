import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestVexflowComponent } from './test-vex-flow.component';

describe('TestVexflowComponent', () => {
  let component: TestVexflowComponent;
  let fixture: ComponentFixture<TestVexflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestVexflowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestVexflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
