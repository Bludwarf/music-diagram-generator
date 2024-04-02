import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartTabsComponent } from './part-tabs.component';
import {Structure} from "../../../structure/structure";

describe('PartTabsComponent', () => {
  let component: PartTabsComponent;
  let fixture: ComponentFixture<PartTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartTabsComponent);
    component = fixture.componentInstance;

    component.structure = new Structure([])

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
