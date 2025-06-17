import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetlistTocComponent } from './setlist-toc.component';

describe('SetlistTocComponent', () => {
  let component: SetlistTocComponent;
  let fixture: ComponentFixture<SetlistTocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetlistTocComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetlistTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
