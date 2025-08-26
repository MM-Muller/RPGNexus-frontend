import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCardComponent } from './character-card.component';

describe('CharacterCardComponent', () => {
  let component: CharacterCardComponent;
  let fixture: ComponentFixture<CharacterCardComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the correct title and description', () => {
    component.title = 'HUMANO';
    component.description = 'Versáteis exploradores da Terra.';

    fixture.detectChanges();

    const titleElement = compiled.querySelector('.heading');
    const descriptionElement = compiled.querySelector('.description');

    expect(titleElement?.textContent).toContain('HUMANO');
    expect(descriptionElement?.textContent).toContain(
      'Versáteis exploradores da Terra.'
    );
  });

  it('should apply correct CSS classes for a race card', () => {
    component.type = 'race';
    component.subtype = 'hybrid';
    fixture.detectChanges();

    const cardElement = compiled.querySelector('.card');

    expect(cardElement?.classList.contains('race-hybrid')).toBe(true);
  });

  it('should apply correct CSS classes for a class card', () => {
    component.type = 'class';
    component.subtype = 'pilot';
    fixture.detectChanges();

    const cardElement = compiled.querySelector('.card');

    expect(cardElement?.classList.contains('class-pilot')).toBe(true);
  });

  it('should render the specific inner element for a synthetic icon', () => {
    component.subtype = 'synthetic';
    fixture.detectChanges();

    const ledElement = compiled.querySelector('.synthetic-figure .led');
    expect(ledElement).toBeTruthy();
  });

  it('should render the specific inner element for a pilot icon', () => {
    component.subtype = 'pilot';
    fixture.detectChanges();

    const helmetElement = compiled.querySelector('.pilot-figure .helmet');
    expect(helmetElement).toBeTruthy();
  });

  it('should NOT render a .led element if the subtype is not synthetic', () => {
    component.subtype = 'human';
    fixture.detectChanges();

    const ledElement = compiled.querySelector('.human-figure .led');
    expect(ledElement).toBeFalsy();
  });
});
