import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Placement } from './placement';

describe('Placement', () => {
  let component: Placement;
  let fixture: ComponentFixture<Placement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Placement]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Placement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
