import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerachSelect } from './serach-select';

describe('SerachSelect', () => {
  let component: SerachSelect;
  let fixture: ComponentFixture<SerachSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerachSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerachSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
