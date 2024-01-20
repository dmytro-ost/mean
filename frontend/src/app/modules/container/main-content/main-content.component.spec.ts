import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentComponent } from './main-content.component';

describe('MainContentComponent', () => {
  let component: MainContentComponent;
  let fixture: ComponentFixture<MainContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainContentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a 'Photos' button`, () => {
    const fixture = TestBed.createComponent(MainContentComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.photos-btn')?.textContent).toContain('Photos');
  });

  it(`should have a 'Favorites' button`, () => {
    const fixture = TestBed.createComponent(MainContentComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.favorites-btn')?.textContent).toContain('Favorites');
  });
});
