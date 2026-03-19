import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Singin } from './singin';

describe('Singin', () => {
  let component: Singin;
  let fixture: ComponentFixture<Singin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Singin],
    }).compileComponents();

    fixture = TestBed.createComponent(Singin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
