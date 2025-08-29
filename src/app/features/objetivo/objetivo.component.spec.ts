import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectiveNodeComponent } from '../../components/objective-node/objective-node.component';
import { ObjetivoComponent } from './objetivo.component';

describe('ObjetivoComponent', () => {
  let component: ObjetivoComponent;
  let fixture: ComponentFixture<ObjetivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjetivoComponent, ObjectiveNodeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the main title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.main-title')?.textContent).toContain(
      'OBJETIVOS CÓSMICOS'
    );
  });

  it('should render the subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.subtitle')?.textContent).toContain(
      'Nexus Galáctico'
    );
  });

  it('should render short term objectives', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const shortTermObjectives = compiled.querySelectorAll(
      '.objective-section:first-of-type app-objective-node'
    );
    expect(shortTermObjectives.length).toBe(
      component.shortTermObjectives.length
    );
  });

  it('should render long term objectives', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const longTermObjectives = compiled.querySelectorAll(
      '.objective-section:last-of-type app-objective-node'
    );
    expect(longTermObjectives.length).toBe(component.longTermObjectives.length);
  });
});
