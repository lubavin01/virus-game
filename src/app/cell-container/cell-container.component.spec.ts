import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellContainerComponent } from './cell-container.component';

describe('GridContainerComponent', () => {
  let component: CellContainerComponent;
  let fixture: ComponentFixture<CellContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
