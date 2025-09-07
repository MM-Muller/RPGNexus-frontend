import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService } from 'src/app/core/services/character.service';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.scss']
})
export class CharacterCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  characterForm: FormGroup;
  pointsRemaining: number = 10;
  baseAttributeValue: number = 10;

  private trailInterval: any;

  private raceIcons: { [key: string]: string } = {
    'Humano': '🌍',
    'Sintético': '🤖',
    'Híbrido': '🧬',
    'Expatriado': '🚀'
  };

  private classIcons: { [key: string]: string } = {
    'Cientista': '🔭',
    'Piloto': '✈️',
    'Diplomata': '🕊️',
    'Aventureiro': '⚔️'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private characterService: CharacterService 
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      race: ['', Validators.required],
      char_class: ['', Validators.required],
      description: [''],
      attributes: this.fb.group({
        strength: [this.baseAttributeValue],
        intelligence: [this.baseAttributeValue],
        charisma: [this.baseAttributeValue],
        dexterity: [this.baseAttributeValue],
        intuition: [this.baseAttributeValue],
      })
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createStars();
    this.createRocketTrail();
  }

  ngOnDestroy(): void {
    if (this.trailInterval) {
      clearInterval(this.trailInterval);
    }
  }

  selectRace(race: string): void {
    this.characterForm.get('race')?.setValue(race);
  }

  selectClass(className: string): void {
    this.characterForm.get('char_class')?.setValue(className);
  }

  adjustAttribute(attribute: string, amount: number): void {
    const control = this.characterForm.get(`attributes.${attribute}`);
    if (control) {
      const currentValue = control.value;
      const futureValue = currentValue + amount;

      if (amount > 0 && this.pointsRemaining > 0) {
        control.setValue(futureValue);
        this.pointsRemaining--;
      } else if (amount < 0 && currentValue > this.baseAttributeValue) {
        control.setValue(futureValue);
        this.pointsRemaining++;
      }
    }
  }

  confirmCharacter(): void {
    if (this.characterForm.valid) {
      const formValue = this.characterForm.value;
      const characterData = {
        ...formValue,
        race_icon: this.raceIcons[formValue.race],
        class_icon: this.classIcons[formValue.char_class]
      };

      this.characterService.createCharacter(characterData).subscribe({
        next: (response) => {
          console.log('Personagem criado com sucesso:', response);
          this.router.navigate(['/game/characters']);
        },
        error: (err) => {
          console.error('Falha ao criar personagem:', err);
        }
      });
    }
  }

  cancelCreation(): void {
    this.router.navigate(['/game/characters']);
  }

  createStars(): void {
    const starsContainer = this.el.nativeElement.querySelector('#stars');
    if (!starsContainer) return;

    for (let i = 0; i < 100; i++) {
      const star = this.renderer.createElement('div');
      this.renderer.addClass(star, 'star');
      this.renderer.setStyle(star, 'left', `${Math.random() * 100}%`);
      this.renderer.setStyle(star, 'top', `${Math.random() * 100}%`);
      this.renderer.setStyle(star, 'animation-delay', `${Math.random() * 3}s`);
      this.renderer.appendChild(starsContainer, star);
    }
  }

  createRocketTrail(): void {
    const rocket = this.el.nativeElement.querySelector('#rocket');
    const scene = this.el.nativeElement.querySelector('.space-scene');
    if (!rocket || !scene) return;

    this.trailInterval = setInterval(() => {
      const rect = rocket.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();

      const particle = this.renderer.createElement('div');
      this.renderer.addClass(particle, 'trail-particle');
      this.renderer.setStyle(particle, 'left', `${rect.left - sceneRect.left + rect.width / 2}px`);
      this.renderer.setStyle(particle, 'top', `${rect.top - sceneRect.top + rect.height}px`);

      this.renderer.appendChild(scene, particle);

      setTimeout(() => {
        this.renderer.removeChild(scene, particle);
      }, 1000);
    }, 50);
  }
}