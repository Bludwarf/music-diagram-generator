import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureGridComponent } from './structure-grid.component';

describe('StructureGridComponent', () => {
  let component: StructureGridComponent;
  let fixture: ComponentFixture<StructureGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StructureGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
