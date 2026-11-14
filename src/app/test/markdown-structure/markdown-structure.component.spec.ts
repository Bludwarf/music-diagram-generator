import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownStructureComponent } from './markdown-structure.component';

describe('MarkdownStructureComponent', () => {
  let component: MarkdownStructureComponent;
  let fixture: ComponentFixture<MarkdownStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownStructureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkdownStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
