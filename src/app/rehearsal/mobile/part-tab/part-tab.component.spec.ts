import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartTabComponent } from './part-tab.component';
import {Part} from "../../../structure/part/part";
import {Structure} from "../../../structure/structure";
import {PartInStructure} from "../../../structure/part/part-in-structure";

describe('PartTabComponent', () => {
  let component: PartTabComponent;
  let fixture: ComponentFixture<PartTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartTabComponent);
    component = fixture.componentInstance;

    const part = new Part('Intro', [])
    const structure = new Structure([part])
    component.partInStructure = new PartInStructure(part, structure, [])

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
