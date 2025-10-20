import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StructurePageComponent} from './structure-page.component';
import {SongInSetlist} from "../setlist-pages/setlist";
import {StructureInGrid} from "../structure-grid/StructureInGrid";
import {Structure} from "../../structure/structure";

describe('StructurePageComponent', () => {
  let component: StructurePageComponent;
  let fixture: ComponentFixture<StructurePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructurePageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StructurePageComponent);
    component = fixture.componentInstance;

    component.song = createSong()

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function createSong() {
  const structure = new Structure([]);
  const songEntry = {
    name: "Morceau",
    structure
  };
  return new SongInSetlist(songEntry, new StructureInGrid(structure));
}
