import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JudgeCompetitionPage } from './judge-competition.page';

describe('JudgeCompetitionPage', () => {
  let component: JudgeCompetitionPage;
  let fixture: ComponentFixture<JudgeCompetitionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeCompetitionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
