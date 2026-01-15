import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalSlider } from './global-slider';

describe('GlobalSlider', () => {
  let component: GlobalSlider;
  let fixture: ComponentFixture<GlobalSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalSlider],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
