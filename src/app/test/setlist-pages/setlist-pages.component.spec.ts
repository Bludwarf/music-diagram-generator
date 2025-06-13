import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetlistPagesComponent } from './setlist-pages.component';

describe('SetlistPagesComponent', () => {
  let component: SetlistPagesComponent;
  let fixture: ComponentFixture<SetlistPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetlistPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetlistPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
