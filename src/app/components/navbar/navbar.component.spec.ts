import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the clicked item as active', () => {
    expect(component.navItems[0].active).toBe(true);
    expect(component.navItems[1].active).toBe(false);

    const secondItem = component.navItems[1];
    component.onNavItemClick(secondItem);

    expect(component.navItems[0].active).toBe(false);
    expect(component.navItems[1].active).toBe(true);
  });
});
