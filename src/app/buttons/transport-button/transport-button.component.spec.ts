import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TransportButtonComponent} from './transport-button.component';

describe('TransportButtonComponent', () => {
    let component: TransportButtonComponent;
    let fixture: ComponentFixture<TransportButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TransportButtonComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TransportButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
