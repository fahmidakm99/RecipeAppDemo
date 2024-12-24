import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleRecipieInfoPage } from './single-recipie-info.page';

describe('SingleRecipieInfoPage', () => {
  let component: SingleRecipieInfoPage;
  let fixture: ComponentFixture<SingleRecipieInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRecipieInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
