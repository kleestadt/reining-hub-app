import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JudgeHomePage } from './judge-home.page';

describe('JudgeHomePage', () => {
  let component: JudgeHomePage;
  let fixture: ComponentFixture<JudgeHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
