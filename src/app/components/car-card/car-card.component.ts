import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Car } from '../../core/models/car.model';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card p-0 overflow-hidden group hover:-translate-y-2 font-body h-full flex flex-col">
      <!-- Cinematic Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

      <!-- Image Container -->
      <div class="relative h-56 overflow-hidden">
        <img
          [src]="car.images[0]"
          [alt]="car.brand + ' ' + car.model"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <!-- Cinematic Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>

        <!-- Favorite Button -->
        <button
          (click)="toggleFavorite()"
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center border border-border/50 shadow-lg hover:bg-primary hover:text-white transition-all duration-300 z-20 hover:scale-110"
          [title]="isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'"
        >
          <i [class.pi-heart-fill]="isFavorite" [class.pi-heart]="!isFavorite"
             [class.text-primary]="isFavorite"
             class="pi text-base group-hover:text-white transition-all"></i>
        </button>

        <!-- Condition Badge -->
        <div
          class="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg z-20 backdrop-blur-sm border border-white/10"
          [class.bg-primary]="car.condition === 'new'"
          [class.text-white]="car.condition === 'new'"
          [class.bg-secondary]="car.condition === 'used'"
          [class.text-foreground]="car.condition === 'used'"
        >
          {{ car.condition === 'new' ? 'جديد' : 'مستعمل' }}
        </div>

        <!-- Price -->
        <div class="absolute bottom-4 left-6 z-20">
          <div class="text-2xl font-black text-foreground font-display drop-shadow-lg">
            {{ car.price | number }} ر.س
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 flex-1 flex flex-col relative z-10">
        <!-- Title -->
        <h3 class="text-xl font-black text-foreground mb-1 font-display group-hover:text-primary transition-colors">
          {{ car.brand }} {{ car.model }}
        </h3>

        <!-- Year and Mileage -->
        <p class="text-[10px] font-black text-muted-foreground mb-4 uppercase tracking-widest">
           موديل {{ car.year }} • {{ car.mileage | number }} كم
        </p>

        <!-- Rating -->
        @if (car.rating) {
          <div class="flex items-center gap-2 mb-5">
            <i class="pi pi-star-fill text-primary text-base"></i>
            <span class="text-sm font-black text-foreground">{{ car.rating }}</span>
            <span class="text-[10px] text-muted-foreground font-bold mr-2">({{ car.reviews }} تقييم)</span>
          </div>
        }

        <!-- Specs Grid -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="bg-secondary/40 p-2.5 rounded-lg border border-border/30 flex flex-col">
            <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">الوقود</span>
            <span class="text-xs font-bold text-foreground">{{ car.fuelType }}</span>
          </div>
          <div class="bg-secondary/40 p-2.5 rounded-lg border border-border/30 flex flex-col">
            <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">ناقل الحركة</span>
            <span class="text-xs font-bold text-foreground">{{ car.transmission }}</span>
          </div>
        </div>

        <!-- Action -->
        <div class="mt-auto flex gap-3">
          <button
            [routerLink]="['/cars', car.id]"
            class="flex-1 btn btn-primary py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-glow"
          >
            عرض التفاصيل
          </button>
          <button
            (click)="compare()"
            class="w-12 h-12 flex items-center justify-center bg-secondary border border-border rounded-xl hover:border-primary hover:text-primary transition-all duration-300 shadow-sm"
            title="مقارنة"
          >
            <i class="pi pi-arrow-right-arrow-left"></i>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CarCardComponent {
  @Input() car!: Car;
  @Input() isFavorite: boolean = false;
  @Output() favoriteToggle = new EventEmitter<string>();
  @Output() compareClick = new EventEmitter<string>();

  toggleFavorite(): void {
    this.favoriteToggle.emit(this.car.id);
  }

  compare(): void {
    this.compareClick.emit(this.car.id);
  }
}
