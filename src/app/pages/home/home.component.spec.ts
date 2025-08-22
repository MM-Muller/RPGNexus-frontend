import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('NEXUS');
  });

  it('should have correct subtitle', () => {
    expect(component.subtitle).toBe('GALÁCTICO');
  });

  it('should render title in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.main-title')?.textContent).toContain(
      'NEXUS'
    );
  });

  it('should render subtitle in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.subtitle')?.textContent).toContain(
      'GALÁCTICO'
    );
  });
});
