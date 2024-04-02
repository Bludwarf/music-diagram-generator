import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PartLineComponent} from './part-line.component';
import {PartInStructure} from "../../../structure/part/part-in-structure";
import {Part} from "../../../structure/part/part";
import {Structure} from "../../../structure/structure";

describe('PartLineComponent', () => {
  let component: PartLineComponent;
  let fixture: ComponentFixture<PartLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartLineComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PartLineComponent);
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
