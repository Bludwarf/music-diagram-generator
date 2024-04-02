import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StructureMapComponent} from './structure-map.component';
import {Structure} from "../../../structure/structure";

describe('StructureMapComponent', () => {
  let component: StructureMapComponent;
  let fixture: ComponentFixture<StructureMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StructureMapComponent);
    component = fixture.componentInstance;

    component.structure = new Structure([])

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
