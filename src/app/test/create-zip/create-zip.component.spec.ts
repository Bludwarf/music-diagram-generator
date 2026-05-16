import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateZipComponent} from './create-zip.component';

describe('CreateZipComponent', () => {
    let component: CreateZipComponent;
    let fixture: ComponentFixture<CreateZipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateZipComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CreateZipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
