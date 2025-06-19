import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeFooterComponent } from './before-footer.component';

describe('BeforeFooterComponent', () => {
  let component: BeforeFooterComponent;
  let fixture: ComponentFixture<BeforeFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeforeFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
