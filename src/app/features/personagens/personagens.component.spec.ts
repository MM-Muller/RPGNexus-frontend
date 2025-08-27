import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { PersonagensComponent } from './personagens.component';

describe('PersonagensComponent', () => {
  let component: PersonagensComponent;
  let fixture: ComponentFixture<PersonagensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonagensComponent, CharacterCardComponent],
    });
    fixture = TestBed.createComponent(PersonagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the main title "PERSONAGENS"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.main-title');
    expect(titleElement?.textContent).toContain('PERSONAGENS');
  });

  it('should render the "Raças Disponíveis" section title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sectionTitle = compiled.querySelector('.section-title');
    expect(sectionTitle?.textContent).toContain('Raças Disponíveis');
  });

  it('should render 4 race cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const raceCards = compiled.querySelectorAll(
      '.section:first-of-type app-character-card'
    );
    expect(raceCards.length).toBe(4);
  });

  it('should render 4 class cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const classCards = compiled.querySelectorAll(
      '.section:last-of-type app-character-card'
    );
    expect(classCards.length).toBe(4);
  });
});
