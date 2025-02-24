import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySpacePage } from './my-space.page';

describe('MySpacePage', () => {
  let component: MySpacePage;
  let fixture: ComponentFixture<MySpacePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MySpacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
